var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var net = require('net');
var ping = require('ping');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const {URLSearchParams} = require('url');
var MA = require('./MobileAgent.js');
// var SubjectiveLogicFramework = require('./SubjectiveLogicFramework.js');

// Intializing web3 Modules and providing ganache RPC url
web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.2:8545"));

//Global Decleration of variables and arrays
var commResult = [];
var nodeEnergy = 100000;
var packetSend = '';
var deliveryACK = 0;
var respACK = 0;
var attackType = 0;
var forwardingBehaviour = 0;
var nodEnergyMean = 0;
var lastEnergyMeasTime = 0;
var totalNumberOfMessages = 0;
var nodePrivateKey = '';
var nodePAddress = '';
var nodeFogAddress = '';

function autoComm(tmp,light,smoke,address,path,ack) {

    const options = {
      hostname: address,
      port: 3000,
      path: path,
      method: 'POST'
    };
    const req = http.request(options, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
        respACK++;
      });
    });
    req.on('error', (err) => {
      //console.error(err);
    });
    message = {"Temperature" : tmp , "Light" : light , "ACK" : ack};
    req.write(JSON.stringify(message));
    req.end();
    totalNumberOfMessages++;
    console.log("Packet Messages for 192.168.1.3 = " + totalNumberOfMessages);
    var toSave = {"Sender" : "192.168.1.3", "Receiver" : address, "Temperature" : tmp, "light" : light, "ACK" : ack}
    commResult.push(toSave);
}

// function for verifying IoT Nodes trust
function verifyTrust(naddress,faddress,key) {

  var fogAddress = faddress;
  var nodeAddress = naddress;
  var pvtKey = key;

  const account1 = nodeAddress;
  web3.eth.defaultAccount = account1;
  const privateKey1 = Buffer.from(pvtKey, 'hex');

  // adding smart contract data
  const abi = [ { "constant": false, "inputs": [ { "internalType": "uint8", "name": "_nodeTrust", "type": "uint8" }, { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" } ], "name": "addDeviceTrust", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_fogName", "type": "uint256" } ], "name": "addFogNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" }, { "internalType": "address", "name": "_fogAddress", "type": "address" } ], "name": "addNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogDeviceMapping", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fogIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogNodes", "outputs": [ { "internalType": "uint256", "name": "fogName", "type": "uint256" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "iotNodes", "outputs": [ { "internalType": "uint256", "name": "nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "nodeSystem", "type": "uint256" }, { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" }, { "internalType": "address", "name": "nodeAddress", "type": "address" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "nodeIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "readMessage", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "removeNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" } ], "name": "sendMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalFogNodes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalIoTDevice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "trustMapping", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "verifyTrust", "outputs": [ { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  const contract_Address = "0x51998FA044c3c674B295a14209D70Dad552d3aB2";
  const contract = new web3.eth.Contract(abi, contract_Address);

  // adding data
  const myData = contract.methods.addNode(nodeName,systemID,fogAddress).encodeABI();

  // transacting Data
  web3.eth.getTransactionCount(account1, (err, txCount) => {
    // Build the transaction
  const txObject = {
    nonce:    web3.utils.toHex(txCount),
    to:       contract_Address,
    value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
    gasLimit: web3.utils.toHex(2100000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
    data: myData
  }
    // Sign the transaction
    const tx = new Tx(txObject);
    tx.sign(privateKey1);

    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    // Broadcast the transaction
    const transaction = web3.eth.sendSignedTransaction(raw, (err, tx) => { }).then((tx) => {  });
  });
}

function addNodeData(nodepaddress, nodeprivatekey,faddress) {
  nodePAddress = nodepaddress;
  nodePrivateKey = nodeprivatekey;
  nodeFogAddress = faddress;

  return nodePAddress;
}

//Node Server Creation
var server = http.createServer(function (req, resp) {
  if (req.url === "/")
  {
    fs.readFile("index.html", function (error, pgResp)
    {
      if (error)
      {
        resp.writeHead(404);
        resp.write('Contents you are looking are Not Found');
      } else {
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write(pgResp);
      }
      resp.end();
    });
  }

  else if (req.url === "/images/gg.png")
  {
    var img = fs.readFileSync('images/gg.png');
    resp.writeHead(200, {'Content-Type': 'image/png' });
    resp.end(img,'binary');
  }

  else if (req.url === "/images/refresh.ico")
  {
    var img = fs.readFileSync('images/refresh.ico');
    resp.writeHead(200, {'Content-Type': 'image/ico' });
    resp.end(img, 'binary');
  }

  else if (req.url === "/favicon.ico")
  {
    var img = fs.readFileSync('images/favicon.ico');
    resp.writeHead(200, {'Content-Type': 'image/ico' });
    resp.end(img, 'binary');
  }

else if (req.url === "/pathJavascript") {
      fs.readFile('js/javascript.js', function (err, data) {
                resp.writeHead(200, { 'Content-Type': 'text/javascript' });
                resp.end(data, 'utf-8');
                resp.end();
              });
    } else if (req.url === "/pathJquery") {
      console.log("called");
      fs.readFile('js/jquery.js', function (err, data) {
                resp.writeHead(200, { 'Content-Type': 'text/javascript' });
                resp.end(data, 'utf-8');
                resp.end();
              });
    } else if (req.url === "/pathCSS") {
      fs.readFile('css/style.css', function (err, data) {
                resp.writeHead(200, {'Content-Type': 'text/css'});
                resp.end(data, 'utf-8');
                resp.end();
              });
    }

  //Calculating the forward behaviour of Device A
  else if(req.url === "/testA") {
      //resp.write("Response Acknowledged by 192.168.1.3");
      resp.write(" ");
      var body = ''
      req.on('data', function(data)
      {
        body += data;
        var luqma = JSON.parse(body);
        if(attackType == 1) {
          autoComm(0, 0, 0, '192.168.1.4','/test10',0);
          nodeEnergy -= 0.0108;
        }
        else if (attackType == 2) {
          for (var i = 0; i>0; i++) {
            if (i%3 == 0) {
              autoComm(0, 0, 0, '192.168.1.4','/test10',0);
              nodeEnergy -= 0.0108;
            }
          }
        } else {
          autoComm(0, 0, 0, '192.168.1.4','/testA',0);
          nodeEnergy -= 0.0108;
          //console.log("Message of 192.168.1.5 Forwarded to 192.168.1.4");
        }
      });
    }

  //Calculating the forward behaviour of Device B
  else if(req.url === "/testB") {
      var body = ''
      req.on('data', function(data)
      {
        body += data;
        var luqma = JSON.parse(body);
        if(luqma['ACK'] == 1) {
          //console.log("Delivery Acknowldegemt Received from 192.168.1.5");
          deliveryACK++;
          nodeEnergy -= 0.0108;
        }
      });
    }


  //Calculating the forward behaviour of Device C
  else if(req.url === "/testC") {
      var body = ''
      req.on('data', function(data)
      {
        body += data;
        var luqma = JSON.parse(body);
        autoComm(0, 0, 0, '192.168.1.4','/testC',1);
        //console.log("Delivery Acknowledgment Send to 192.168.1.4");
        nodeEnergy -= 0.0108;
      });
    }

    else if(req.url === "/mobileAgent") {
      //console.log("Function Called!");
      var forwardingBehaviour1 = deliveryACK/respACK;
          resp.write("Mobile Agent Received by 192.168.1.3");
    	     var array = [];
    	     var body = '';
    	     req.on('data', function(data)
           {
            	   body += data;
            	   var luqma = JSON.parse(body);
                 var routePlan =  luqma['routePlan'];
            	   var mobileAgent = new MA("192.168.1.3",routePlan);
                 mobileAgent.addDetails("192.168.1.4",forwardingBehaviour1,"192.168.1.3",Math.round(nodeEnergy));
                 mobileAgent.moveAgent();
          	});
    }

  else
  {
    resp.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin' : '*'});
    let params;
    params = new URLSearchParams(req.url);
    var func=params.get('/data?func');
    if(func==1)
    {
      var tmp = params.get('temp');
      var light = params.get('light');
      autoComm(tmp,light,0,'192.168.1.4','/testB',0);
      packetSend++;
      forwardingBehaviour = deliveryACK/respACK;
      resp.end(JSON.stringify({ "energy": nodeEnergy, "fb": forwardingBehaviour }));
      //resp.end(JSON.stringify(commResult));
    }

    else if(func==2)
    {
      attackType = 1;
	  }

    else if(func==3)
    {
      attackType = 2;
	  }

    else if(func==4)
    {
      attackType = 0;
	  }

    else if(func==5)
    {
      var result = (deliveryACK / respACK) * 100;
      //console.log("Forwarding Behaviour of 192.168.1.4 is " + result);
      resp.write(JSON.stringify(result));
    }

    else if(func==6)
    {
      resp.end(JSON.stringify(nodeEnergy));
    }

    else if(func==7)
    {
      var nodeID = params.get('nodeID');
      var result = verifyTrust(nodeID, nodeFogAddress, nodePrivateKey);
      resp.end(JSON.stringify(result));
    }

    else if(func==8)
    {
      var nodeID = params.get('nodeID');
      var nodePrivateKey = params.get('nodePrivateKey');
      var fogAddress = params.get('fogAddress');
      var result = addNodeData(nodeID, nodeFogAddress, nodePrivateKey);
      resp.end(JSON.stringify(result));
    }
  }
});
server.listen(3000,'0.0.0.0'); // To be changed by IP
