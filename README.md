#Mongoose-rollback
This EXPERIMENTAL module helps to rollback a mongodb query.
Mongodb doesn't support rollback operations, so i've implemented a workaround using mongoose ❤.

##How to use it
Build your query with mongoose and execute it using the **executeSafeQuery()** method:

##Examples

###Update
```js
var mongoose = require('mongoose'),
	MongooseRollback = require('MongooseRollback'),
	People = mongoose.model('People'),
	mongooseRollback = new MongooseRollback(),
	//query builder
	query = People.update({name: 'Vincenzo'}, {$set: {job: 'UX Specialist'}});

//The method returns a new MRQuery instance.
//The MRQuery instance is also added to the standard mongoose query callback
var safeQuery = mongooseRollback.executeSafeQuery(query, function (err, updated, mrquery) {
	if (err || !updated) {
		throw('Error!');	
	}
	
	//Rollback
	mrquery.rollback(function (err) {
		if (!err) {
			console.log('Rollback executed');
		}
	});
});

```

###Creation

```js
...

var me = new People();
me.name = 'Vincenzo';
me.lastname = 'Trapani';
me.job = 'WebDeveloper';

//Use the 'People' object
var safeQuery = mongooseRollback.executeSafeQuery(me, function (err, updated, mrquery) {
	if (err || !updated) {
		throw('Error!');	
	}
	
	//Rollback
	mrquery.rollback(function (err) {
		if (!err) {
			console.log('Rollback executed');
		}
	});
});
```

###Remove
```js
...

query = People.remove({_id: '539704287ac743880e61df90'});

var safeQuery = mongooseRollback.executeSafeQuery(query, function (err, updated, mrquery) {
	if (err || !updated) {
		throw('Error!');	
	}
	
	//Rollback
	mrquery.rollback(function (err) {
		if (!err) {
			console.log('Rollback executed');
		}
	});
});
```


You can also rollback *n* safeQueris at the same time.

```js

var safeQuery = mongooseRollback.executeSafeQuery(query, function (err, updated, mrquery) {
	if (err || !updated) {
		throw('Error!');	
	}
});


var safeQuery2 = mongooseRollback.executeSafeQuery(query, function (err, updated, mrquery) {
	if (err || !updated) {
		throw('Error!');	
	}
});


var safeQuery3 = mongooseRollback.executeSafeQuery(query, function (err, updated, mrquery) {
	if (err || !updated) {
		throw('Error!');	
	}
});


mongooseRollback.rollbackAll([safeQuery, safeQuery2, safeQuery3], function (err) {
	if (!err) {
		console.log('Rollback completed');
	}
});

```

##Limitations
Actually the rollback doesn't work with the findOneAnd* methods of mongoose.

##Test
You need mongodb up and running
```js
npm test
```

##TODO
- Test, test and re-test with real and particular cases
- Implement the rollback for the findOneAnd* methods


##Disclamers
THIS IS AN EXPERIMENTAL MODULE. USE AT YOUR OWN RISK!

##License
MIT