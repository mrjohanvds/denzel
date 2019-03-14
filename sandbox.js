/* eslint-disable no-console, no-process-exit */
const imdb = require('./src/imdb');
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://johanvds:1776@cluster0-lvc0g.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "movies";
const COLLECTION_NAME = "movie";
const DENZEL_IMDB_ID = 'nm0000243';

var database, collection;


MongoClient.connect(uri, {useNewUrlParser: true}, (error, client) => {
  if(error){
    throw error;
  }
  database = client.db(DATABASE_NAME);
  collection = database.collection(COLLECTION_NAME);
  collection.drop(function(err, delOK){
  if(err) throw err;
  if(delOK) console.log("Collection deleted");
  });
  console.log("Connected to `" + DATABASE_NAME + "` !");
  sandbox(DENZEL_IMDB_ID, collection, client);
});

app.get('/movies', function(req, res){
  collection.find().toArray(function(err, result){
    if(err) return res.status(500).send(err);
    res.send(result);
  });
})

.get('/movies/search', function(req, res){
  var query = {'metascore':{$gte: parseInt(req.query.metascore)}};
  collection.find(query).sort({metascore: -1}).limit(parseInt(req.query.limit)).toArray(function(err,result){
    if(err) return res.sendStatus(500).send(err);
    res.send(result);
  });
})

.post('/movies/:id', function(req, res){
  collection.updateOne({'id': req.params.id}, {$set:{date : req.body.date, review : req.body.review}}, function(err, result){
    if(err) return res.sendStatus(500).send(err);
    res.send(result.result);
  });
})

.get('/movies/:id', function(req, res){
  collection.find({'id': req.params.id}).toArray(function(err, result){
    if(err) return res.sendStatus(500).send(err);
    res.send(result);
  });
})

async function sandbox (actor, collection, client) {
  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);

    collection.insertMany(movies, function(err, doc){
      if(err) throw err;
      else console.log("Movies imported");
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

app.listen(9292);