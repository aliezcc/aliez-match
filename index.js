'use strict';

var http = require('http'), assert = require('assert'), url = require('url');

var getArgName = function(str){
	assert('string' == typeof str, 'Invalid argument');
	
	var tmp = str.match(/\$[a-zA-Z0-9_]*/g);
	var arr = [];
	try{
		for(var i = 0; i < tmp.length; i++) arr[i] = tmp[i].slice(1);
	}catch(e){
		return [];
	}
	
	return arr;
}

var getArgValue = function(req, str){
	assert('string' == typeof req && 'string' == typeof str, 'Invalid argument');
	
	str = str.replace(/\/\$[a-zA-Z0-9_]*/g, '/(.*)');
	str = str.replace(/\//g, '\\/');
	
	try{
		var result = req.match(new RegExp('^' + str + '$')).slice(1);
	}catch(e){
		return [];
	}
	return result;
}

module.exports = function(req, res, done){
	assert(req instanceof http.IncomingMessage, 'Invalid argument');
	assert(res instanceof http.ServerResponse, 'Invalid argument');
	assert('function' == typeof done, 'Invalid argument');
	
	req.match = function(rule, cb){
		assert(rule instanceof RegExp || 'string' == typeof rule, 'Invalid argument');
		assert('function' == typeof cb, 'Invalid argument');
		
		var request = url.parse(req.url).pathname;
		var result;
		
		if(rule instanceof RegExp){
			result = request.match(rule);
			if(result){
				var tmp = result.length > 1 ? result.slice(1) : [];
				req.REQUEST = tmp;
				cb.call(this, req, res);
			}
		}else{
			var str = rule.replace(/\//g, '\\/');
			str = str.replace(/\/\$[a-zA-Z0-9_]*/g, '/.*');
			if(new RegExp('^' + str + '$').test(request)){
				var name = getArgName(rule);
				var val = getArgValue(request, rule);
				var tmp = {};
				for(var i = 0; i < name.length; i++) tmp[name[i]] = val[i];
				req.REQUEST = tmp;
				cb.call(this, req, res);
			}
		}
	}
	
	done();
}