'use strict';

var axon = require('axon');
var socket = axon.socket('sub');

socket.connect('http://localhost:3001');

socket.on('error', function (err) {
	throw err;
});

module.exports = socket;