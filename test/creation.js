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

PeopleSchema = new Schema({
	name: String,
	lastname: String,
	job: String
});

mongoose.model('People', PeopleSchema);

People = mongoose.model('People');

mongoose.connection.on('error', function(err){
   
});

var newUser;

describe('Create and destroy a new person', function () {


	
	describe('Create a new person', function () {
		
		before(function (done) {
			newUser = new People();
			newUser.name = 'Vincenzo';
			newUser.lastname = 'Trapani';
			newUser.job = 'WebDeveloper';

			mrquery = mongooseRollback.executeSafeQuery(newUser, function (err, created) {
				if (!err) {
					done();
				}
			});
		});

		it('should be created', function () {
			newUser.should.have.property('name', 'Vincenzo');
		});
	});

	describe('Remove the person created (Rollback)', function (done) {

		before(function (done) {
			mrquery.rollback(function () {
				done();
			});
		});

		
		
			
		it('should be removed', function (done) {
			People.find({_id: newUser._id}, function (err, user) {
				assert.equal(0, user.length);
				done();
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

});
