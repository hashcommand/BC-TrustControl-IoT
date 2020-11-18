var ping = require('ping');
var Promise = require('bluebird');

// make a version of ping.sys.probe that returns a promise when done

function checkConnection(hosts){
    var promises = hosts.map(function(host) {
        return ping.sys.probeAsync(host);
    });
    return Promise.all(promises).then(function(results) {
        return results;
    });
}

ping.sys.probeAsync = function(host){
    return new Promise(function(resolve, reject) {
        ping.sys.probe(host, function(isAlive) {
            resolve({"host": host, "status": isAlive});
        });
    });
}



module.exports.checkConnection = checkConnection;
