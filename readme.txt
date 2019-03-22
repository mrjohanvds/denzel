Create by : Johan VAN DER SLOOTEN
Course : Web Application Architectures
Due to : 22/03/2019

To launch the server, install node.js and enter in your command prompt 'node sanbox.js'.
Once the message 'Movies imported' appears the server is ready. It may take some time depending your connexion.
To properly close the server please press 'ctrl + c' in your command prompt.

The database is automatically filled when the server is lauched, so there is no need to use a query to populate it.

The REST queries are :

GET /movies/all -> to get all the movies.
GET /movies -> to get a random movie.
GET /movies/search?limit=<your_limit>&metascore=<your_metascore> -> to a number of movies > given metascore.
GET /movies/:id -> to get the movie with the given id.
POST /movies/search -> to post a review on the movie with the given id.

The access to the web client : just enter in your web browser 'localhost:9292'.
It will redirect you to the client.
All the REST queries but the random one are made in the client.
The random query is a little bit diffenrent -> it get a random movie with a metascore > 70.

Enjoy and have a pleasant visit.