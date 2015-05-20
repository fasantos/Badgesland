'use strict';

var model = require('../models/pubsub');
var _ = require('underscore');

/*
*  Send badges to model to be saved
*/
exports.save = function(req, res, next) {
	var badges = _.clone(req.body);
	model.save(badges, function (err, data){
		if (err) return res.json(503, {error: true});
		next();
	});
};

/*
* Trim down the redis list
*/
exports.trim = function(req, res, next){
	model.trim();
	next();
};

/*
* Send badges to pub/sub socket in model
*/
exports.send = function(req, res, next){
	var badgesList = _.clone(req.body)
	model.send(badgesList, function (err){
		if (err) return res.send(503, {error: true});
		res.send(200, 'success');
	});
};

/*
* Get 10 badges form model
*/
exports.get = function (req, res, next) {
	model.get(function (err, data){
		res.status(err? 400: 200).json({
			error: err? true: null,
			errorMessage: err? err: null,
			data: data
		});
	});
};