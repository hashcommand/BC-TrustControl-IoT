var http = require('http');
const https = require('https')
var fs = require('fs');
var url = require('url');
var path = require('path');
var net = require('net');
var ping = require('ping');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
var MA = require('./MobileAgent.js');
var SubjectiveLogicFramework = require('./SLF.js');
const {URLSearchParams} = require('url');

// Intializing web3 Modules and providing ganache RPC url
web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.2:8545"));

var seconds1 = new Date().getTime() / 1000;

//Global array to add IP lookup Data
var addFogTx = '';
var lunLink = [];
var arrayBC = [];
var nodeTrustData = [];
var sensorBBehaviour = 0;
var sensorAEnergy = 0;
var sensorABehaviour = 0;
var sensorCEnergy = 0;
var sensorCBehaviour = 0;
var sensorBEnergy = 0;
var sensorALastMeasTime = 0;
var sensorBLastMeasTime = 0;
var sensorCLastMeasTime = 0;
var sensorALastMeasEnergy = 0;
var sensorBLastMeasEnergy = 0;
var sensorCLastMeasEnergy = 0;
var PforA = 0;
var PforB = 0;
var PforC = 0;
var corrFogAddress = '';
var corrPrivateKey = '';
var intialtingTime = seconds1;

// function for IPs lookup
function lookIP() {
  var hosts = [];
  for (var i=0; i<=20;i++) {
    hosts.push('192.168.1.' + i);
  }
  hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){ if (isAlive) { final(host); } });
  });
  //console.log(lunLink);
  return lunLink;
}

// function for adding data into global Ip lookup array
function final(host) {
  lunLink.indexOf(host) === -1 ? lunLink.push(host) : console.log("");
}
function txLog(tx) {
  arrayBC.push(tx);
}

// function for adding fog node
function addFog(id,address,key) {

  corrFogAddress = address;
  corrPrivateKey = key;

  var fogID = id;
  var fogAddress = address;
  var pvtKey = key;

  const account1 = fogAddress;
  web3.eth.defaultAccount = account1;
  const privateKey1 = Buffer.from(pvtKey, 'hex');

  // adding smart contract data
  const abi = [ { "constant": false, "inputs": [ { "internalType": "uint8", "name": "_nodeTrust", "type": "uint8" }, { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" } ], "name": "addDeviceTrust", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_fogName", "type": "uint256" } ], "name": "addFogNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" }, { "internalType": "address", "name": "_fogAddress", "type": "address" } ], "name": "addNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "removeNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" } ], "name": "sendMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogDeviceMapping", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fogIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogNodes", "outputs": [ { "internalType": "uint256", "name": "fogName", "type": "uint256" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "iotNodes", "outputs": [ { "internalType": "uint256", "name": "nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "nodeSystem", "type": "uint256" }, { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" }, { "internalType": "address", "name": "nodeAddress", "type": "address" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "nodeIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "readMessage", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalFogNodes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalIoTDevice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "trustMapping", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "verifyTrust", "outputs": [ { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  const contract_Address = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
  const contract = new web3.eth.Contract(abi, contract_Address);

  // adding data
  const myData = contract.methods.addFogNode(fogID).encodeABI();

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
    const transaction = web3.eth.sendSignedTransaction(raw, (err, tx) => { }).then((tx) => { addFogTx = tx;  });
  });
  return addFogTx;
}

// function for adding trust values
function addTrust(trust,name,naddress,faddress,key) {

  var nodeName = name;
  var trustScore = trust;
  var fogAddress = faddress;
  var nodeAddress = naddress;
  var systemid = '12345';
  var pvtKey = key;

  const account1 = fogAddress;
  web3.eth.defaultAccount = account1;
  const privateKey1 = Buffer.from(pvtKey, 'hex');

  // adding smart contract data
  const abi = [ { "constant": false, "inputs": [ { "internalType": "uint8", "name": "_nodeTrust", "type": "uint8" }, { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" } ], "name": "addDeviceTrust", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_fogName", "type": "uint256" } ], "name": "addFogNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" }, { "internalType": "address", "name": "_fogAddress", "type": "address" } ], "name": "addNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "removeNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" } ], "name": "sendMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogDeviceMapping", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fogIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogNodes", "outputs": [ { "internalType": "uint256", "name": "fogName", "type": "uint256" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "iotNodes", "outputs": [ { "internalType": "uint256", "name": "nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "nodeSystem", "type": "uint256" }, { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" }, { "internalType": "address", "name": "nodeAddress", "type": "address" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "nodeIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "readMessage", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalFogNodes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalIoTDevice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "trustMapping", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "verifyTrust", "outputs": [ { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  const contract_Address = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
  const contract = new web3.eth.Contract(abi, contract_Address);

  // adding data
  const myData = contract.methods.addDeviceTrust(trustScore,nodeName,naddress,systemid).encodeABI();

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

// function for adding IoT Nodes
function addNode(nodeid,systemid,naddress,faddress,key) {

  var nodeName = nodeid;
  var systemID = systemid;
  var fogAddress = faddress;
  var nodeAddress = naddress;
  var pvtKey = key;

  const account1 = nodeAddress;
  web3.eth.defaultAccount = account1;
  const privateKey1 = Buffer.from(pvtKey, 'hex');

  // adding smart contract data
  const abi = [ { "constant": false, "inputs": [ { "internalType": "uint8", "name": "_nodeTrust", "type": "uint8" }, { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" } ], "name": "addDeviceTrust", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_fogName", "type": "uint256" } ], "name": "addFogNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" }, { "internalType": "address", "name": "_fogAddress", "type": "address" } ], "name": "addNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "removeNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" } ], "name": "sendMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogDeviceMapping", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fogIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogNodes", "outputs": [ { "internalType": "uint256", "name": "fogName", "type": "uint256" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "iotNodes", "outputs": [ { "internalType": "uint256", "name": "nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "nodeSystem", "type": "uint256" }, { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" }, { "internalType": "address", "name": "nodeAddress", "type": "address" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "nodeIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "readMessage", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalFogNodes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalIoTDevice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "trustMapping", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "verifyTrust", "outputs": [ { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  const contract_Address = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
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

// function for adding IoT Nodes
function verifyTrust(naddress,faddress,key) {

  var fogAddress = faddress;
  var nodeAddress = naddress;
  var pvtKey = key;

  const account1 = nodeAddress;
  web3.eth.defaultAccount = account1;
  const privateKey1 = Buffer.from(pvtKey, 'hex');

  // adding smart contract data
  const abi = [ { "constant": false, "inputs": [ { "internalType": "uint8", "name": "_nodeTrust", "type": "uint8" }, { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "address", "name": "_nodeAddress", "type": "address" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" } ], "name": "addDeviceTrust", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_fogName", "type": "uint256" } ], "name": "addFogNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "_nodeSystem", "type": "uint256" }, { "internalType": "address", "name": "_fogAddress", "type": "address" } ], "name": "addNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "removeNode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" } ], "name": "sendMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogDeviceMapping", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fogIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "fogNodes", "outputs": [ { "internalType": "uint256", "name": "fogName", "type": "uint256" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "iotNodes", "outputs": [ { "internalType": "uint256", "name": "nodeName", "type": "uint256" }, { "internalType": "uint256", "name": "nodeSystem", "type": "uint256" }, { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" }, { "internalType": "address", "name": "nodeAddress", "type": "address" }, { "internalType": "address", "name": "fogAddress", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "nodeIds", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "readMessage", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalFogNodes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalIoTDevice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "trustMapping", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "_nodeAddress", "type": "address" } ], "name": "verifyTrust", "outputs": [ { "internalType": "uint8", "name": "nodeTrust", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  const contract_Address = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
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

function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }
    return tempArray;
}

function generateAgents(array,agentsToCreate) {

  var toGenerate = agentsToCreate;
  var data = array;
  if(toGenerate == 1) {
    //console.log('yaha working');
    var agent = new mobileAgent;
    agent.currentIP('192.168.1.1');
    agent.iterPlan(data);
  }
}

function testPacket() {

  const options = {
      hostname: '192.168.1.3',
      port: 3000,
      path: '/test',
      method: 'POST'
  };
  const req = http.request(options, (res) => {
      //console.log(`statusCode: ${res.statusCode}`);
      res.on('data', (d) => {
          //process.stdout.write(d);
      });
  });
  req.on('error', (err) => {
      //console.error(err);
  });
  req.write("This is my Message");
  req.end();
}

function sendAgent(array) {
  var mobileAgent = new MobileAgent("192.168.10.2",array);
  mobileAgent.iterPlan();
}

function agentData(object) {


    var seconds = new Date().getTime() / 1000;

  if('192.168.1.4FB' in object) {
    sensorBBehaviour = Math.round(object['192.168.1.4FB']);
    console.log("Forwarding Behaviour of 192.168.1.4 = " + sensorBBehaviour);
  }
  if('192.168.1.3E' in object) {
    //console.log("Energy found at 192.168.1.3E");
    sensorALastMeasEnergy = Math.round(sensorAEnergy);
    sensorAEnergy = Math.round(object['192.168.1.3E']);
    sensorALastMeasTime = seconds;
  }
  if('192.168.1.3FB' in object) {
    sensorABehaviour = Math.round(object['192.168.1.3FB']);
    console.log("Forwarding Behaviour of 192.168.1.3 = " + sensorABehaviour);
  }
  if('192.168.1.5E' in object) {
    sensorCLastMeasEnergy = Math.round(sensorCEnergy);
    sensorCEnergy = Math.round(object['192.168.1.5E']);
    sensorCLastMeasTime = seconds;
  }
  if('192.168.1.5FB' in object) {
    sensorCBehaviour = Math.round(object['192.168.1.5FB']);
    console.log("Forwarding Behaviour of 192.168.1.5 = " + sensorCBehaviour);
  }
  if('192.168.1.4E' in object) {
    sensorBLastMeasEnergy = Math.round(sensorBEnergy);
    sensorBEnergy = Math.round(object['192.168.1.4E']);
    sensorBLastMeasTime = seconds;
  }
}

function calcTrust(frwdngBhr, energy, lastMeasurTime, lastMeasurEnergy,currentTime,Pvalue) {
  var slf = new SubjectiveLogicFramework(frwdngBhr,energy,lastMeasurTime,lastMeasurEnergy,currentTime,Pvalue);
  var nodeTrust =  slf.calTrust();
  return nodeTrust;
}

 function addBlockchain(a,b,c){
   addTrust(a,1,"0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0","0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1","4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d");
   addTrust(b,2,"0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b","0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1","4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d");
   addTrust(a,3,"0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d","0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1","4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d");
}

function totalTime(time) {
  var calculatedTime = time - intialtingTime;
  return calculatedTime;
}

//making server
var server = http.createServer(function (req, resp) {
    if (req.url === "/") {
        fs.readFile("index.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    } else if (req.url === "/images/gg.png") {
      var img = fs.readFileSync('images/gg.png');
      resp.writeHead(200, {'Content-Type': 'image/png' });
      resp.end(img,'binary');
      return;
    } else if (req.url === "/images/refresh.ico") {
      var img = fs.readFileSync('images/refresh.ico');
      resp.writeHead(200, {'Content-Type': 'image/ico' });
      resp.end(img, 'binary');
    } else if (req.url === "/favicon.ico") {
      var img = fs.readFileSync('images/favicon.ico');
      resp.writeHead(200, {'Content-Type': 'image/ico' });
      resp.end(img, 'binary');
    } else if (req.url === "/pathJavascript") {
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

    else if(req.url === "/mobileAgent") {
      var body = ''
      req.on('data', function(data)
      {
        body += data;
        var luqma = JSON.parse(body);
        //console.log(luqma);
        count = Object.keys(luqma).length;
        route = luqma['route'];
        for (var i = 0;i<route.length;i++){
          if(route[i] != '192.168.1.2') {
            var key = route[i];
            agentData(luqma[key][0]);
          }
        }
      });
    }
    else {
      resp.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin' : '*'});
      let params;
      params = new URLSearchParams(req.url);
      var func=params.get('/data?func');
      //var func1=params.get('/test?fun');
      if(func==1){
        resp.end(JSON.stringify(lookIP()));
      }
      else if(func==2) {
			var fogID = params.get('fogID');
			var fogAddress = params.get('fogAddress');
      var pvtKey = params.get('pvtKey');
      var tmpVar =  addFog(fogID,fogAddress,pvtKey);
			resp.end(JSON.stringify(fogAddress));
		  }
      else if(func==3) {
          var agentsToCreate = params.get('agentNmbrToCreate');
          var array = params.get('data1');
          var myObj = JSON.parse(array);
          var iterPlanArray = [];
          countData = Object.keys(myObj).length;
            for (var i = 0; i < countData; i++) {
              var agent = new MA('192.168.1.2', myObj[i].Plan);
              agent.moveAgent();
            }
      } else if(func==4) {
        var seconds = new Date().getTime() / 1000;
        var a = calcTrust(sensorABehaviour, sensorAEnergy, sensorALastMeasTime, sensorALastMeasEnergy, seconds, PforA);
        var b = calcTrust(sensorBBehaviour, sensorBEnergy, sensorBLastMeasTime, sensorBLastMeasEnergy, seconds, PforB);
        var c = calcTrust(sensorCBehaviour, sensorCEnergy, sensorCLastMeasTime, sensorCLastMeasEnergy, seconds, PforC);
          if(Math.round(a) > 49) {
            //console.log("Trust Value of A = " + a);
            PforA += 1;
          }
          if(Math.round(b) > 49) {
            //console.log("Trust Value of B = " + b);
            PforB += 1;
          }
          if(Math.round(c) > 49) {
            //console.log("Trust Value of C = " + c);
            PforC += 1;
          }

          //addBlockchain(Math.round(a),Math.round(b),Math.round(c));
          resp.end(JSON.stringify({"SensorA" : Math.round(a), "SensorB" : Math.round(b), "SensorC" : Math.round(c)}));
      }
      else if(func==5) {
        //access
      } else if(func==6) {
        var nodeID = params.get('nodeID');
        var sysID = params.get('sysID');
        var nodePAddress = params.get('nodePAddress');
        var key = params.get('pvtKey');
        var result = addNode(nodeID,sysID,nodePAddress,"0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",key);
        resp.end(JSON.stringify(nodeID));
      } else if(func==7) {
        	var seconds = new Date().getTime() / 1000;
          var result =  totalTime(seconds);
          //console.log(result);
      }

    }
});

server.listen(3000,'0.0.0.0');
