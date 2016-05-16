var md5 		= require('md5');
var moment 		= require('moment');
var fs 			= require('fs');
var request 	= require('request');
var parser 		= require('JSONStream');
var utcTime = moment().utc().format("YYYYMMDDHHmmss");
var baseUri = 'http://api.smitegame.com/smiteapi.svc/';
var sessionId;

var Config = require("./config.json");

try {
    sessionId = fs.readFileSync("session.txt", "utf8");
} catch (e) {
    if (e.code === "ENOENT") {
        sessionId = createSession(Config.devId, Config.authKey);
    }
}

try {
	player = getPlayer(Config.devId, Config.authKey, sessionId, 'joetheory');
	console.log(player);

} catch(e) {
	console.log(e);
}
console.log(player);
// Creates a Session Signature that will be used for
// every call to the API
function createSession(devId, authKey) {
    var hash = md5(Config.devId + "createsession" + Config.authKey + utcTime)
    request(baseUri + 'createsessionJson/' + Config.devId + '/' + hash + '/' + utcTime).pipe(parser.parse('session_id')).pipe(fs.createWriteStream('session.txt'));
}

function getPlayer(devId, authKey, sessionId, playerName){
    var hash = md5(devId + "getplayer" + authKey + utcTime)
   	return request(baseUri + "getplayerjson/" + devId + '/' + hash + '/' + sessionId + '/' + utcTime + '/' + playerName).pipe(parser.parse("*")).pipe(parser.stringify()).pipe(fs.createWriteStream('player.json'));
}

exports.createSession = createSession;
exports.getPlayer = getPlayer;