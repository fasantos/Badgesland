'use strict';

var express = require('express');
var app = express();
var pubsub = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyparser = require('body-parser');

var subSocket = require('./lib/subscribe');
var badges = require('./models/badges');
var pubsubctrl = require('./controllers/pubsub');


/*
* Parse data from incoming requests
*/
app.use(bodyparser.json());

/*
* Accept POST request and then publish the body of the request
*/
pubsub.post('/', pubsubctrl.save, pubsubctrl.trim, pubsubctrl.send);

/*
* Get the most recent 10 badges
*/
pubsub.get('/', pubsubctrl.get);

/*
* Have our server listen on port 3000
*/
var port = process.env.PORT || 3000
server.listen(port, function(){
	console.log('Server is running on port %d\nTo turn of the server, press ctrl-c', port);
});

/*
* Serve static assets out of public directory
*/
app.use(express.static('public'))

/*
* Send the public/index.html to the browser
*/
app.get('/', function(req, res){
	res.sendfile('./public/index.html');
});

/*
* Get the most recent 10 badges
*/
app.use('/badges', pubsub);

/*
* Watch for connections
*/
io.sockets.on('connection', function(socket){
	badges.get(function(err, data){
		if (err) {return};
		data.forEach(function(badge){
			socket.emit('badge', badge);
		});
	});
});

/*
* When a message comes in from the pub/sub system, send it to the sockets
*/
subSocket.on('message', function(message){
	io.sockets.emit('badge', message);
});
