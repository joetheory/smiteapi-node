var md5 		= require('md5');
var moment 		= require('moment');
var http 		= require('http');

var apiUrlBase 	= 'http://api.smitegame.com/smiteapi.svc/';
var requestType = 'json';
var timestamp	=	null;
var session 	=	null;

//Establish config
var config = {
    devId: '1063',
    authKey: '34F03C32BCF246159E80350672E3D6BE'
};


session = genSession();
console.log(session.session_id);

function genSession(options){

    var devId = config.devId;
    var authKey = config.authKey;
    var utcTime = new moment().utc().format("YYYYMMDDHHmmss");
    var authHash = md5(devId + "createsession" + authKey + utcTime);
    var baseUrl = 'http://api.smitegame.com/smiteapi.svc/createsessionjson/';
    var sessionUrl = baseUrl + devId + '/' + authHash + '/' + utcTime;


   	callback = function(response) {
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			data = JSON.parse(str);
			return data;
		});
	}

	http.request(sessionUrl, callback).end();

 }