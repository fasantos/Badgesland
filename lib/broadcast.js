'use strict';

var axon = require('axon');
var socket = axon.socket('pub');

/*
* Bind the pub sub socket to localhost:4001
*/
socket.bind(3001)

/*
* On Error
*/
socket.on('error', function (err) {
	throw err;
});

/*
* send badge to the publisher socket
*/
exports.send = function(badge){
	socket.send(badge);
};