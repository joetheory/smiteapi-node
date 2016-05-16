var md5 		= require('md5');
var moment 		= require('moment');
var http 		= require('http');

var apiUrlBase 	= 'http://api.smitegame.com/smiteapi.svc/';
var Config = require("./config.json");

var session = generateSession();

function generateSession() {

	var devId = Config.devId;
    var authKey = Config.authKey;
    var utcTime = new moment().utc().format("YYYYMMDDHHmmss");
    var authHash = md5(devId + "createsession" + authKey + utcTime);
    var baseUrl = 'http://api.smitegame.com/smiteapi.svc/createsessionjson/';
    var sessionUrl = baseUrl + devId + '/' + authHash + '/' + utcTime;

    var test = http.get(sessionUrl, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            // Data reception is done, do whatever with it!
            var sessionObj = JSON.parse(body);
            console.log(sessionObj);
	    });
	});

	return test;
}