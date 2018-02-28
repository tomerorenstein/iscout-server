/**
 * Created by Tomer on 28-Feb-18.
 */

const models = require('../../models');
const dbConn = models.dbConn;

/**
 * Query player's basic info by userid
 * @param userid
 * @param cb
 */
exports.getPlayerInfo = function (userid, cb) {

    // Gets current player basic info
    dbConn.query(`SELECT name, age, favourite_leg,
                  (select ps.position from players_positions as ps where ps.id = pbi.position) as position,
                  country, team, own_description  
                  FROM iscout.players_basic_info as pbi
                  WHERE pbi.id = 
                     (SELECT rel.player_id 
                      FROM users_to_players_rel as rel 
                      WHERE rel.user_id = ?)`, [userid], cb);
};

/**
 * Query player's statistics by userid
 * @param userid
 * @param cb
 */
exports.getPlayerStatistics = function (userid, cb) {

    // Gets current player basic info
    dbConn.query(`SELECT year, goals, assists, games_in_starting_linup, games_entered_from_bench,
                  yellow_cards, red_cards, average_km_per_game   
                  FROM players_yearly_statistics as pys
                  WHERE pys.player_id = 
                     (SELECT rel.player_id 
                      FROM users_to_players_rel as rel 
                      WHERE rel.user_id = ?)`, [userid], cb);
};