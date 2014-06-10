'use strict';

var MRQuery = require('./mrquery');

/**
* Mongoose Rollback helps to rollback a query
* 
*/
function MongooseRollback() {};


/**
 * Executes the query and returns the response
 * 
 * @param {Object} a mongoose query
 * @param {Function} [fn] query callback
 * @return {MRQuery} instance
 * @api public
 *
 * Examples: 
 * 	//UPDATE
 *  executeSafeQuery(People.update({name: 'Luke'}, {$set:{lastname: 'Skywalker'}}), function (err, updated) {...});
 * 
 *  //CREATION
 *  var me = new People();
 *	me.name = 'Vincenzo';
 *	me.lastname = 'Trapani';
 *	me.jobTitle = 'WebDeveloper';
 *		
 *	mongooseRollback.executeSafeQuery(me, function (err, saved, mrquery) {...});
 * 
 */
MongooseRollback.prototype.executeSafeQuery = function (query, cb) {
	var mrQuery = new MRQuery(query, function (err, updated) {
		cb(err, updated, mrQuery);
	});

	return mrQuery;

};

/**
 * Multiple rollback
 *
 * @param {Array} safeQueris
 * @param {Function} callback
 */
MongooseRollback.prototype.rollbackAll = function (safeQueris, callback) {
	var count = safeQueris.length;

	for (var sq in safeQueris) {
		if (safeQueris.hasOwnProperty(sq)) {
			safeQueris[sq].rollback(function (err) {
				count--;

				if (count <= 0) {
					callback();
				}
			});
		}
	}
}


module.exports = MongooseRollback;