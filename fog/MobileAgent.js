var http = require('http');

class MobileAgent {

	constructor(currntIP,itrnRoutePlan) {
		this.currntIP = currntIP;
		this.nextIP = '';
		this.frdgBhvr = '';
		this.enrgy = '';
		this.httpreq = '';
		this.destinationIP = '';
		this.itrnRoutePlan = itrnRoutePlan;
		this.nodesDetails = [];
		this.nodeData = {};
		this.routePlans = [];
		this.mobileAgent1 = [];
		this.message = '';
		this.totalMessages = 0;
		}

	 currentIP () {
		return this.currntIP;
	}

	nextIP (ip) {
		this.nextIP = ip;
		return this.nextIP;
	}

	addPlan() {
		this.routePlans = this.itrnRoutePlan;
	}

	analyzeIP() {
		var i = 0
			if(this.currntIP == "192.168.1.2") {
				this.nextIP = this.itrnRoutePlan[i];
			} else if (this.currntIP == this.itrnRoutePlan[i]) {
				this.nextIP = this.itrnRoutePlan[i+1];
			} else if (this.currntIP == '192.168.1.2') {
				this.nextIP = "192.168.1.2";
			}
			return this.nextIP;
		}

	moveAgent () {
		this.nextIP = this.analyzeIP();
		const options = {
      hostname: this.nextIP,
      port: 3000,
      path: '/mobileAgent',
      method: 'POST'
    };
		const req = http.request(options, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
				//console.log(d);
			});
    });
    req.on('error', (err) => {
    });
    this.message = {"routePlan" : this.itrnRoutePlan};
    req.write(JSON.stringify(this.message));
    req.end();
		this.totalMessages++;
		//console.log("Agent Total Messages on 192.168.1.2 = " + this.totalMessages);
	}
}

module.exports = MobileAgent;
