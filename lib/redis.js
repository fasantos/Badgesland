'use strict';

var redis = require('redis');
if (process.env.REDISTOGO_URL) {
	var redisURL = require('url').parse(process.env.REDISTOGO_URL);
	var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check:true});

	client.auth(redisURL.auth.split(":")[1]);
}else{
	var client = redis.createClient(6379, 'localhost', {no_ready_check:true});
};

client.on('error', function(err){
	throw err;
});

module.exports = client;