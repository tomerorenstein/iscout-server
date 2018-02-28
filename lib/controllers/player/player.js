/**
 * Created by Tomer on 13-Nov-16.
 */
const models = require('../../models');
const iscountconf = require('../../config').iscout;
const dbConn = models.dbConn;

const generatePlayerStats = function(){
  return {
      year: 2017,
      goals: 20,
      assists: 1,
      game_in_starting_linup: 3,
      games_entered_from_bench: 34,
      yellow_cards: 2,
      red_cards: 5,
      average_km_per_game: 5.5
  };
};

/**
 * This function registers new user to IScout app
 * @param request
 * @param reply
 */
exports.register = async function (request, reply) {

    // Checks if username already exists
    dbConn.query("SELECT 1 as isUsernameExists FROM users WHERE username=?",
        [request.payload.username], function (err, results) {

        if (err){
            reply(models.Boom.badImplementation(err));
        } else {

            // Gets the result
            let isUsernameExists = (results.length !== 0);

            if (isUsernameExists) {

                // if exists - send error - username already exists
                reply(models.Boom.conflict('username already exists'));
            } else {

                // Randomize player statistics
                let playerStats = generatePlayerStats();

                // Saves to database - one transaction
                dbConn.beginTransaction(function(err) {

                     if (err){
                         reply(models.Boom.badImplementation(err));
                     } else {

                         // Inserts new user to users table - gets user id
                         // Inserts new player basic info - gets player id
                         dbConn.query(`INSERT INTO users 
                                       (username, password, type) 
                                       VALUES (?, ?, 1); 
                                       INSERT INTO players_basic_info 
                                       (name, age, favourite_leg, position, country, team) 
                                       VALUES (?, ?, ?, ?, ?, ?)`,
                                      [request.payload.username, request.payload.password,
                                       request.payload.name, request.payload.age, request.payload.leg,
                                       iscountconf.positions[request.payload.position], request.payload.country,
                                       request.payload.team], function(err, results){

                                 if (err) {
                                     dbConn.rollback(function () {
                                         reply(models.Boom.badImplementation(err));
                                     });
                                 } else {

                                    let userid = results[0].insertId;
                                    let playerid = results[1].insertId;

                                    // Inserts new user and player to users_player_rel table
                                    // Inserts new player yearly statistics
                                    dbConn.query(`INSERT INTO users_to_players_rel 
                                                  (user_id, player_id) 
                                                  VALUES (?, ?); 
                                                  INSERT INTO players_yearly_statistics 
                                                  (player_id, year, goals, assists, games_in_starting_linup,
                                                  games_entered_from_bench,yellow_cards,red_cards,
                                                  average_km_per_game) 
                                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                        [userid, playerid, playerid, playerStats.year, playerStats.goals,
                                         playerStats.assists, playerStats.game_in_starting_linup,
                                         playerStats.games_entered_from_bench, playerStats.yellow_cards,
                                         playerStats.red_cards, playerStats.average_km_per_game], function (err, results) {
                                       if (err){
                                           dbConn.rollback(function () {
                                               reply(models.Boom.badImplementation(err));
                                           });
                                       } else {

                                           // Commit
                                           dbConn.commit(function (err) {

                                               if (err){
                                                   dbConn.rollback(function () {
                                                       reply(models.Boom.badImplementation(err));
                                                   });
                                               } else {
                                                   // sends 200 code - ok
                                                   reply().code(200);
                                               }
                                           });
                                       }
                                    });
                                 }
                         });
                     }
                });
            }
        }
    });
};
