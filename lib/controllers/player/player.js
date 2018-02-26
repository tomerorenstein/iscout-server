/**
 * Created by Tomer on 13-Nov-16.
 */
let models = require('../../models');
let dbConn = models.db;

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
 *
 * @param request
 * @param reply
 */
exports.register = async function (request, reply) {

    try {

        // Checks if username already exists
        let [isUserExists] =
            await dbConn("SELECT 1 FROM USERS WHERE username=?", [request.payload.username]);

        if (isUserExists) {

            // if exists - send error - username already exists
            reply(models.Boom.conflict('username already exists'));
        } else {

            // Randomize player statistics
            let playerStats = generatePlayerStats();

            // Saves to database

            // sends 200 code - ok

            //throw new Error('fail');
        }
    } catch (err){
        reply(models.Boom.badImplementation());
    }
};
