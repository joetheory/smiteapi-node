var md5 		= require('md5');
var moment 		= require('moment');
var http 		= require('http');

var Config = require("./config.json");

function createCall(method, isSession) {
	// Get the current time for the call
	var utcTime = new moment().utc().format("YYYYMMDDHHmmss");
	// Create the stupid hash
	var authHash = md5(Config.devId + method + Config.authKey + utcTime);
	if (isSession) {
		//createsession[ResponseFormat]/{developerId}/{signature}/{timestamp}
		var callAddress = Config.apiHost + method + Config.format + '/' + Config.devId + '/' + authHash + '/' + utcTime;
	} else {
		//getdataused[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
		var callAddress = Config.apiHost + method + Config.format + '/' + Config.devId + '/' + authHash + '/' + session + '/' + utcTime;
	}
	console.log(callAddress);
	return callAddress;
}

function makeCall(callAddress) {
	http.get(callAddress, function(res){
        var body = '';
        res
            .on('data', function(chunk){
                body += chunk;
                }
            )
            .on('end', function(){
                    console.log('body data: ' + body);
            }
        );
        
    }).on('error', function(error){
        console.error(error);
    });

}

var callAddress = createCall('createsession',true);
var call = makeCall(callAddress);
