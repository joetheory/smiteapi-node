var md5 = require('md5');
var moment = require('moment');
var http = require('http');
var parser = require('JSONStream');
var Config = require("./config.json");

genSession().then(function(data){console.log(data)})

function genSession(options){

    var devId = Config.devId;
    var authKey = Config.authKey;
    var utcTime = new moment().utc().format("YYYYMMDDHHmmss");
    var authHash = md5(devId + "createsession" + authKey + utcTime);
    var baseUrl = 'http://api.smitegame.com/smiteapi.svc/createsessionjson/';
    var sessionUrl = baseUrl + devId + '/' + authHash + '/' + utcTime;

    return new Promise(function(resolve, reject){
        http.get(sessionUrl, function(res){
        
            if(200 !== res.statusCode){
                reject(new Error(res.statusMessage));
            }else{
                var body = '';
                res
                    .on('data', function(chunk){
                            body += chunk;
                        }
                    )
                    .on('end', function(){
                            resolve(body);
                        }
                    );
            }
        }).on('error', function(error){
            console.error(error);
            reject(new Error('error making API call: ' + error));//TODO: check if JSON
        });
    });
}

exports.genSession;