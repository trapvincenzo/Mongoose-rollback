var mongoose = require('mongoose'),
	MongooseRollback = require('../lib/'),
	mongooseRollback = new MongooseRollback(),
	db = mongoose.connect('mongodb://localhost/mongo-rollback-test'),
	Schema = mongoose.Schema,
	PeopleSchema,
	assert = require('assert'),
	should = require('should'),
	newUser,
	mrquery,
	People;


People = mongoose.model('People');

var newUser;

mongoose.connection.on('error', function(err){
   // console.log(err);
});

describe('Update a person', function () {

	describe('Create a new person', function () {
		
		before(function (done) {
			newUser = new People();
			newUser.name = 'Vincenzo';
			newUser.lastname = 'Trapani';
			newUser.job = 'WebDeveloper';
			newUser.save(function (err) {
				if(!err) done();
			});

		});

		it('should be created', function () {
			newUser.should.have.property('name', 'Vincenzo');
		});

		it('job tile should be "WebDeveloper"', function () {
			assert.equal(newUser.job, 'WebDeveloper');
		});
	});

	describe('Modify person', function () {
		it('Job title should be "UX Specialist"', function (done) {
		 	mrquery = mongooseRollback.executeSafeQuery(People.update({_id: newUser._id}, {job: 'UX Specialist'}), function (err, person) {
				People.find({_id: newUser._id}, function (err, person) {
					assert.equal(person[0].job, 'UX Specialist');
					done();
				});
				
			});	
		});
	});


	describe('Rollback', function () {
		it('Job title should be "WebDeveloper"', function (done) {
			mrquery.rollback(function () {
				People.find({_id: newUser._id}, function (err, person) {
					assert.equal(person[0].job, 'WebDeveloper');
					done();
				});
			});
		});
	});

	describe('Remove person', function () {
		it('should be removed', function (done) {
			People.remove({_id: newUser._id}, function () {
				done();
			});
		});
	});


	describe('Remove all', function () {
		it('db should not exist anymore', function (done) {
			mongoose.connection.db.dropDatabase();

			done();
		});
	});
	


});
