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
  database.collection(COLLECTION_NAME).drop(function(err, delOK){
  if(err) throw err;
  if(delOK) console.log("Collection deleted");
  })
  console.log("Connected to `" + DATABASE_NAME + "` !");
  sandbox(DENZEL_IMDB_ID, database, client);
  
  app.get('/movies', function(req, res){
    database.collection(COLLECTION_NAME).find().toArray(function(err, result){
      if(err) return res.status(500).send(error);
      //res.send(result);
      res.render('index.ejs', {movies : "title"});
    });/*
    res.render('index.ejs', {movies : "title"});*/
    client.db;
  });


});


async function sandbox (actor, database, client) {
  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= 77);

    database.collection(COLLECTION_NAME).insertMany(movies, function(err, doc){
      if(err) throw err;
      else console.log("Movies imported");
      client.close();
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

app.listen(8080);