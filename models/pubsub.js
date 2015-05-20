'use strict';

var redis = require('../lib/redis'); 
var broadcast = require('../lib/broadcast');
var _ = require('underscore');
var io = require('socket.io-client');
var socket = io.connect('https://node-soup.herokuapp.com:80');

socket.on('badge', function(badge) {
	redis.lpush('badges', JSON.stringify(badge), function (err,data) {
		if (err) {return callback(err,null);};
		redis.ltrim('badges', 0, 9, function (err) {
			if (err) {throw err;};
			broadcast.send(badge);
		});
	});  
});

/*
* Save badges to database
* @param {Array} badges
* @param {Function} callback
*/
exports.save = function(badges, callback){
	if (!badges.length) {return callback(null, null);};
	var badge = badges.pop();

	redis.lpush('badges', JSON.stringify(badge), function (err,data) {
		if (err) {return callback(err,null);};
		exports.save(badges, callback);
	});
};

/*
* Trim down the redis list
*/
exports.trim = function(){
	redis.ltrim('badges', 0, 9, function (err) {
		if (err) {throw err;};
	});
};

/*
* Send out badges to the broadcaster
* @param {Array} badges 
* @param {function} callback
*/
exports.send = function(badges, callback){
	badges.forEach(broadcast.send);
	callback(null, null);
};

/*
* Get 10 badges from redis
* @param {function} callback
*/
exports.get = function(callback){
	redis.lrange('badges', 0, -1, function (err, data) {
		if (err) {return callback(err,null);};
		callback(null, data.map(JSON.parse));
	});
};
