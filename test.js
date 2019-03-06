var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://johanvds:1776@cluster0-lvc0g.mongodb.net/test?retryWrites=true";

var client = new MongoClient(uri, {useNewUrlParser: true});
client.connect(uri, function(err, client){
	if(err){
		console.log('Error occurred while connecting to MongoDB Altas...\n', err);
	}
	console.log('Connected...');
	var collection = client.db("imbd").collection("movies");

	client.close();
});