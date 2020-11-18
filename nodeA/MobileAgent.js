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
		this.mobileAgent = [];
		this.previousData = [];
		this.message = '';
		this.frwrdingBheaviourIP = '';
		this.curIP = '';
		this.numberOfMessages = 0;
		}

	 currentIP (ip) {
		this.currntIP = ip;
		return this.currntIP;
	}

	nextIP (ip) {
		this.nextIP = ip;
		return this.nextIP;
	}

	analyzeIP() {
		var i = 0;
			if(this.currntIP == "192.168.1.2") {
				this.nextIP = this.itrnRoutePlan[i];
			} else if (this.currntIP == this.itrnRoutePlan[i]){
				this.nextIP = this.itrnRoutePlan[i+1];
			} else {
				this.nextIP = "192.168.1.2";
			}
			return this.nextIP;
		}

	addDetails (frwrdingBheaviourIP,frwrdingBheaviour,curIP,energy) {
		this.nodeData = {
			'192.168.1.4FB' : frwrdingBheaviour,
			'192.168.1.3E' : energy
		};
		this.nodesDetails.push(this.nodeData);
	}

	previousData1 (data) {
		this.previousData = data;
		return this.previousData;
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
				if (d != "") {
						//console.log(d);
				}
			});
		});
		req.on('error', (err) => {
			//console.error(err);
		});
		this.message = {"route" : this.itrnRoutePlan, "192.168.1.3" : this.nodesDetails};
		//console.log(this.message);
		this.numberOfMessages++;
		console.log("Agent Messages = " + this.numberOfMessages);
		req.write(JSON.stringify(this.message));
		req.end();
	}

	 finalResult() {
		return nodesDetails;
	}
}

module.exports = MobileAgent;
