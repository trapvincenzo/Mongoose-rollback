'use strict';

/**
 * Modules dependencies.
 */
var mongoose = require('mongoose');


/**
 * MRQuery
 *
 * Creates a backup for the documents that are involved in the query,
 * executes the query and returns the result
 *
 * @param {Object} query: mongoose query
 * 
 */
function MRQuery(query, cb) {

	if (query.constructor.name !== 'Query') {
		this.isNew = true;
		this.cachedDocuments = [query.toObject()];
	}

	this.conditions = query._conditions;
	this.model = mongoose.model(this.isNew ? query.constructor.modelName : query.model.modelName);
	this.operation = query.op;

	this.createBackup(function () {
		query[this.isNew ? 'save' : 'exec'](function (err, resp) {
			cb(err, resp)
		});
	});
};

/**
 * Query conditions
 *
 * @property conditions
 */
MRQuery.prototype.conditions;

/**
 * Query model
 *
 * @property model
 */
MRQuery.prototype.model;


/**
 * Creates a backup of the documents
 * 
 * @param {Function}[fn] next function to call after the backup operation ended
 * @api private
 */
MRQuery.prototype.createBackup = function (next) {
	var that = this;

	if (this.isNew) {

		next.call(that);
		return;
	}

	this.model.find(this.conditions).exec(function (err, documents) {
		if (!err) {
			that.cachedDocuments = documents;
			next.call(that);
		}
	});
};

/**
 * Restores saved documents using the internal backup
 *
 * @param {Function} [fn] rollback callback
 * @api public
 */
MRQuery.prototype.rollback = function (callback) {
	var documentsCount = this.cachedDocuments.length || 1,
		query;

	
	for (var doc in this.cachedDocuments) {
		var id = this.cachedDocuments[doc]._id,
			currentDocument;


		if (this.cachedDocuments.hasOwnProperty(doc)) {

			if (this.isNew) {
				query = this.model.remove({_id: id});
			} else {
				currentDocument = this.cachedDocuments[doc].toObject();
				delete currentDocument._id;

				query = this.model.update({_id: id}, {$set: currentDocument}, { upsert: true });
			}

			query.exec(function (err, updated) {
				documentsCount--;
				
				if (documentsCount <= 0) {
					this.cachedDocuments =  null;
					callback();
				}
			});
		}

		
	}
};

module.exports = MRQuery;
