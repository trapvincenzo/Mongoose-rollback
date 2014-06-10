var mongoose = require('mongoose'),
	MongooseRollback = require('../lib/'),
	mongooseRollback = new MongooseRollback(),
	db = mongoose.connect('mongodb://localhost/mongo-rollback-test'),
	Schema = mongoose.Schema,
	PeopleSchema,
	assert = require('assert'),
	should = require('should'),
	newUser1,
	newUser2,
	newUser3,
	mrquery1,
	mrquery2,
	mrquery3,
	People;


People = mongoose.model('People');

var newUser;

mongoose.connection.on('error', function(err){
   // console.log(err);
});

describe('Create and remove 3 persons', function () {
	
	describe('Create a new person', function () {
		it('should be created', function (done) {
			newUser1 = new People();
			newUser1.name = 'Vincenzo';
			newUser1.lastname = 'Trapani';
			newUser1.job = 'WebDeveloper';
			mrquery1 = mongooseRollback.executeSafeQuery(newUser1, function (err, created) {
				if (!err) {
					done();
				}
			});
		});
		
	});

	describe('Create a new person', function () {
		it('should be created', function (done) {
			newUser2 = new People();
			newUser2.name = 'Vincenzo2';
			newUser2.lastname = 'Trapani2';
			newUser2.job = 'WebDeveloper';
			mrquery2 = mongooseRollback.executeSafeQuery(newUser2, function (err, created) {
				if (!err) {
					done();
				}
			});
		});
		
	});

	describe('Create a new person', function () {
		it('should be created', function (done) {
			newUser3 = new People();
			newUser3.name = 'Vincenzo3';
			newUser3.lastname = 'Trapani3';
			newUser3.job = 'WebDeveloper';
			mrquery3 = mongooseRollback.executeSafeQuery(newUser3, function (err, created) {
				if (!err) {
					done();
				}
			});
		});
	});


	describe('Rollback all', function () {
		it('should be removed', function (done) {
			mongooseRollback.rollbackAll([mrquery1, mrquery2, mrquery3], function (err) {
				if (!err) {
					People.find({}, function (err, user) {
						assert.equal(0, user.length);
						done();
					});
				}
			});
		});
	});


});
