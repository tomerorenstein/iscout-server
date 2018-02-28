/**
 * Created by Tomer on 13-Nov-16.
 */
const models = require('../../models');
const utils = require('../../utils');
const iscountconf = require('../../config').iscout;
const dbConn = models.dbConn;

/**
 * Randomize specific parameter by player position
 * @param parameter - statistical parameter (goals, assists, average_km_per_game)
 * @param playerPosition
 * @returns {number}
 */
const getStatByPlayerPosition = function (parameter, playerPosition) {

    // Switches on current player position
    switch(playerPosition) {
        case iscountconf.positions.GK:
            if (parameter === iscountconf.stats_params.average_km_per_game) {
                return utils.numberRandomize(0.1, 1, true);
            } else {
                return 0;
            }
            break;
        case iscountconf.positions.CD:
            if (parameter === iscountconf.stats_params.average_km_per_game) {
                return utils.numberRandomize(3, 6, true);
            } else if (parameter === iscountconf.stats_params.goals){
                return utils.numberRandomize(0, 3, false);
            } else if (parameter === iscountconf.stats_params.assists){
                return utils.numberRandomize(0, 2, false);
            }
            break;
        case iscountconf.positions.MD:
            if (parameter === iscountconf.stats_params.average_km_per_game) {
                return utils.numberRandomize(4, 10, true);
            } else if (parameter === iscountconf.stats_params.goals){
                return utils.numberRandomize(0, 15, false);
            } else if (parameter === iscountconf.stats_params.assists){
                return utils.numberRandomize(0, 21, false);
            }
            break;
        case iscountconf.positions.ST:
            if (parameter === iscountconf.stats_params.average_km_per_game) {
                return utils.numberRandomize(5, 9, true);
            } else if (parameter === iscountconf.stats_params.goals){
                return utils.numberRandomize(0, 20, false);
            } else if (parameter === iscountconf.stats_params.assists){
                return utils.numberRandomize(0, 12, false);
            }
            break;
        default:
            return -1;
    }
};

/**
 * Generate specific player yearly statistics - currently random
 * @param playerPosition
 * @returns {{year: number, goals: number, assists: number, game_in_starting_linup,
  *          games_entered_from_bench, yellow_cards, red_cards, average_km_per_game: number}}
 */
const generatePlayerStats = function(playerPosition){
  return {
      year: 2017,
      goals: getStatByPlayerPosition(iscountconf.stats_params.goals, playerPosition),
      assists: getStatByPlayerPosition(iscountconf.stats_params.assists, playerPosition),
      game_in_starting_linup: utils.numberRandomize(0, 42, false),
      games_entered_from_bench: utils.numberRandomize(0, 37, false),
      yellow_cards: utils.numberRandomize(0, 13, false),
      red_cards: utils.numberRandomize(0, 6, false),
      average_km_per_game: getStatByPlayerPosition(iscountconf.stats_params.average_km_per_game, playerPosition)
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
                let playerStats = generatePlayerStats(request.payload.position);

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
                                       iscountconf.positionsToId[request.payload.position], request.payload.country,
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
