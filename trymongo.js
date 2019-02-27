const { MongoClient } = require('mongodb');
const assert = require('assert');
const async = require('async');

function testWithCallbacks() {
  // Connection URL
  const url = 'mongodb://localhost:27017';

  // Database Name
  const dbName = 'playground';

  // Create a new MongoClient
  const client = new MongoClient(url);

  // Use connect method to connect to the Server
  client.connect(function(err) {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    const db = client.db(dbName);

    const collection = db.collection('employees');

    collection.find({ id: 1 }).toArray(function(err2, docs) {
      assert.equal(err2, null);
      console.log('Found the following records');
      console.log(docs);
    });

    // collection.insertOne({ id: 1, name: 'A. Callback' }, function(
    //   errC,
    //   result
    // ) {
    //   console.log('Result of insert:', result.insertedId);
    //   db.collection('employees')
    //     .find({ id: 1 })
    //     .toArray(function(err2, docs) {
    //       console.log('Result of find:', docs);
    //     });
    // });
    client.close();
  });

  //   MongoClient.connect(
  //     'mongodb://localhost:27017/playground',
  //     { useNewUrlParser: true },
  //     function(err, db) {
  //       assert.equal(null, err);
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log('Connected correctly to server');
  //         console.log(db);
  //         // db.collection('employees').insertOne(
  //         //   { id: 1, name: 'A. Callback' },
  //         //   function(err, result) {
  //         //     console.log('Result of insert:', result.insertedId);
  //         //     db.collection('employees')
  //         //       .find({ id: 1 })
  //         //       .toArray(function(err, docs) {
  //         //         console.log('Result of find:', docs);
  //         //         db.close();
  //         //       });
  //         //   }
  //         // );
  //         db.close();
  //       }
  //     }
  //   );
}

function testWithPromises() {
  let db;
  MongoClient.connect('mongodb://localhost:27017')
    .then(connection => {
      db = connection.db('playground');
      return db
        .collection('employees')
        .insertOne({ id: 1, name: 'B. Promises' });
    })
    .then(result => {
      console.log('Result of insert:', result.insertedId);
      return db
        .collection('employees')
        .find({ id: 1 })
        .toArray();
    })
    .then(docs => {
      console.log('Result of find:', docs);
      // db.close();
    })
    .catch(err => {
      console.log('ERROR', err);
    });
}

function testWithGenerator() {
  const co = require('co');
  co(function*() {
    const db = yield MongoClient.connect('mongodb://localhost/playground');

    const result = yield db
      .collection('employees')
      .insertOne({ id: 1, name: 'C. Generator' });
    console.log('Result of insert:', result.insertedId);

    const docs = yield db
      .collection('employees')
      .find({ id: 1 })
      .toArray();
    console.log('Result of find:', docs);

    db.close();
  }).catch(err => {
    console.log('ERROR', err);
  });
}

function testWithAsync() {
  let db;
  async.waterfall(
    [
      next => {
        MongoClient.connect('mongodb://localhost/playground', next);
      },
      (connection, next) => {
        db = connection;
        db.collection('employees').insertOne({ id: 1, name: 'D. Async' }, next);
      },
      (insertResult, next) => {
        console.log('Insert result:', insertResult.insertedId);
        db.collection('employees')
          .find({ id: 1 })
          .toArray(next);
      },
      (docs, next) => {
        console.log('Result of find:', docs);
        db.close();
        next(null, 'All done');
      }
    ],
    (err, result) => {
      if (err) console.log('ERROR', err);
      else console.log(result);
    }
  );
}

function usage() {
  console.log('Usage:');
  console.log('node', __filename, '<option>');
  console.log('Where option is one of:');
  console.log('  callbacks   Use the callbacks paradigm');
  console.log('  promises    Use the Promises paradigm');
  console.log('  generator   Use the Generator paradigm');
  console.log('  async       Use the async module');
}

if (process.argv.length < 3) {
  console.log('Incorrect number of arguments');
  usage();
} else if (process.argv[2] === 'callbacks') {
  testWithCallbacks();
} else if (process.argv[2] === 'promises') {
  testWithPromises();
} else if (process.argv[2] === 'generator') {
  testWithGenerator();
} else if (process.argv[2] === 'async') {
  testWithAsync();
} else {
  console.log('Invalid option:', process.argv[2]);
  usage();
}
