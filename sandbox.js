const imdb = require('./src/imdb');
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const favicon = require("serve-favicon");
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
  collection = database.collection(COLLECTION_NAME);/*
  collection.drop(function(err, delOK){
  if(err) throw err;
  if(delOK) console.log("Collection deleted");
  });*/
  console.log("Connected to `" + DATABASE_NAME + "` !");
  sandbox(DENZEL_IMDB_ID, collection, client);
});

app.use(favicon(__dirname + "/icon.ico"))

/* #region Web queries */

.get('/web/movies/all', function(req, res){
  collection.find().toArray(function(err, result){
    if(err) return res.status(500).send(err);
    //res.send(result);
    res.render('index.ejs', {movies: result});
  });
})

.get('/web/movies', function(req,res){
  collection.aggregate([{$match: {metascore: {$gte : 70}}},{$sample: {size: 1}}]).toArray(function(err, result){
    if(err) return res.status(500).send(err);
    //res.send(result);
    res.render('index.ejs', {movies: result});
  });
})

.get('/web/movies/search', function(req, res){
  if(req.query.metascore)
    var meta = req.query.metascore;
  else
    var meta = 0;
  if(req.query.limit)
    var lim = req.query.limit;
  else
    var lim = 5;
  var query = {'metascore':{$gte: parseInt(meta)}};
  collection.find(query).sort({metascore: -1}).limit(parseInt(lim)).toArray(function(err,result){
    if(err) return res.sendStatus(500).send(err);
    //res.send(result);
    res.render('index.ejs', {movies: result});
  });
})

.post('/web/movies/:id', function(req, res){
  collection.updateOne({'id': req.params.id}, {$set:{date : req.body.date, review : req.body.review}}, function(err, result){
    if(err) return res.sendStatus(500).send(err);
    res.redirect('/movies/'+req.params.id);
  });
})

.get('/web/movies/:id', function(req, res){
  collection.find({'id': req.params.id}).toArray(function(err, result){
    if(err) return res.sendStatus(500).send(err);
    //res.send(result);
    res.render('index.ejs', {movies: result});
  });
})

/* #endregion */

/* #region REST queries */

app.get('/movies/all', function(req, res){
  collection.find().toArray(function(err, result){
    if(err) return res.status(500).send(err);
    res.send(result);
  });
})

.get('/movies', function(req,res){
  collection.aggregate([{$sample: {size: 1}}]).toArray(function(err, result){
    if(err) return res.status(500).send(err);
    res.send(result);
  });
})

.get('/movies/search', function(req, res){
  if(req.query.metascore)
    var meta = req.query.metascore;
  else
    var meta = 0;
  if(req.query.limit)
    var lim = req.query.limit;
  else
    var lim = 5;
  var query = {'metascore':{$gte: parseInt(meta)}};
  collection.find(query).sort({metascore: -1}).limit(parseInt(lim)).toArray(function(err,result){
    if(err) return res.sendStatus(500).send(err);
    res.send(result);
  });
})

.post('/movies/:id', function(req, res){
  collection.updateOne({'id': req.params.id}, {$set:{date : req.body.date, review : req.body.review}}, function(err, result){
    if(err) return res.sendStatus(500).send(err);
    res.redirect('/movies/'+req.params.id);
  });
})

.get('/movies/:id', function(req, res){
  collection.find({'id': req.params.id}).toArray(function(err, result){
    if(err) return res.sendStatus(500).send(err);
    res.send(result);
  });
})

/* #endregion */

.use(function(req, res, next){
  res.redirect('/web/movies/all');
});

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

process.on('SIGINT', function(){
  collection.drop(function(err, delOK){
    if(err) throw err;
    if(delOK) {
      console.log("Collection deleted");
      process.exit(1);
    }
  }); 
});
process.on('SIGUSR1', function(){
  collection.drop(function(err, delOK){
    if(err) throw err;
    if(delOK) {
      console.log("Collection deleted");
      process.exit(1);
    }
  }); 
});
process.on('SIGUSR2', function(){
  collection.drop(function(err, delOK){
    if(err) throw err;
    if(delOK) {
      console.log("Collection deleted");
      process.exit(1);
    }
  }); 
});
process.on('uncaughtException', function(){
  collection.drop(function(err, delOK){
    if(err) throw err;
    if(delOK) {
      console.log("Collection deleted");
      process.exit(1);
    }
  }); 
});