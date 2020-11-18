pragma solidity ^0.5.1;

contract BMCTM {
    
    //creating IoT Device Structure for Storing Node Related Values
    struct ioTNode {
        uint256 nodeName;
        uint256 nodeSystem;
        uint8 nodeTrust;
        address nodeAddress;
        address fogAddress;
    }
    
    //Creating Fog Structure for Storing Node Related Values
    struct fogNode {
        uint256 fogName;
        address fogAddress;
    }
    
    //To check Total Number of IoT Devices
    uint256 public totalIoTDevice = 0; 
    uint256 public totalFogNodes = 0;
    
    //To Store Values in Hash Tables
    mapping (address => ioTNode) public iotNodes; // Controlling IoT Devices Data
    mapping (address => fogNode) public fogNodes; // Controlling Fog Data
    mapping (uint256 => uint256) public nodeIds; //Controlling Redundency of IoT Nodes IDs
    mapping (address => address) public fogDeviceMapping; //Saving Fog-Device Mapping
    mapping (address => uint8) public trustMapping; //Saving Device-Trust Values for Decreasing Gas Consumption on Trust Evaluation for IoT Device
    
    //For Communiction between two Nodes
    mapping (address => string) messages;
    
    modifier commNodes(address sender, address receiver) {
        address _senderNode = iotNodes[sender].nodeAddress;
        address _receiverNode = iotNodes[receiver].nodeAddress;
        
        if(_senderNode == address(0)) {
            revert("Sender Node Does not Exist in Network or Not Registered");
        }
        
        if(_receiverNode == address(0)) {
            revert("Receiving Node Does not Exist or Not Registered");
        } 
        
        if(fogDeviceMapping[sender] == address(0)) {
            revert("Device is not authenticated");
        }
        
        if(fogDeviceMapping[receiver] == address(0)) {
            revert("Device is not authenticated");
        }
        _;
    }
    
    modifier checkNode(address receiver) {
        if (iotNodes[receiver].nodeAddress == address(0)) {
            revert("This node is not Registered, Authenticated or Available");
        }
        _;
    }
    
    
    //Function for Adding Fog Nodes
    function addFogNode(uint256 _fogName) public {
        
        address _FogAddress = msg.sender;
        
        if(fogNodes[_FogAddress].fogAddress == _FogAddress) {
            revert('This Fog Node Already Exists');
        } else if(iotNodes[_FogAddress].nodeAddress == _FogAddress) {
            revert('This is Registered As IoT Node');
        } else {
            fogNodes[_FogAddress] = fogNode({fogName:_fogName,fogAddress:_FogAddress});
            totalFogNodes++;
        }
        
    }
    
    //Function for Adding IoT Devices with Initial Trust value = 0
    function addNode (uint256 _nodeName, uint256 _nodeSystem, address _fogAddress) public {
            
            address _nodeAddress = msg.sender;  
            
            if(iotNodes[_nodeAddress].nodeAddress == _nodeAddress) {
                revert('The Node With This Public Address Already Exists');
            } else if(fogNodes[_nodeAddress].fogAddress == _nodeAddress) {
                revert('This is Registered As Fog Node');
            }
            else if (nodeIds[_nodeName] ==_nodeName) {
                revert('The Node With This ID Already Exists');
            } else {
                iotNodes[_nodeAddress] = ioTNode({nodeName:_nodeName,nodeSystem:_nodeSystem,nodeTrust:0,nodeAddress:_nodeAddress,fogAddress:_fogAddress});
                nodeIds[_nodeName] = _nodeName;
                fogDeviceMapping[_nodeAddress] = _fogAddress;
                totalIoTDevice++;
            }
    }
    
    //Function for Editing Trust Value for Each IoT Devices
    function addDeviceTrust (uint8 _nodeTrust, uint256 _nodeName, address _nodeAddress, uint256 _nodeSystem) public {
        address _fogAddress = msg.sender;
        if(fogNodes[_fogAddress].fogAddress != _fogAddress) {
            revert('Fog Address Not Verified');
        } else if(iotNodes[_nodeAddress].fogAddress != _fogAddress) {
            revert('Fog-Node Mapping Not Verified');
        } else {
           // if(true) {
             //   revert('Fog Signature Not Verified');
            //} else {
                iotNodes[_nodeAddress] = ioTNode({nodeName:_nodeName,nodeSystem:_nodeSystem,nodeTrust:_nodeTrust,nodeAddress:_nodeAddress,fogAddress:_fogAddress});
                trustMapping[_nodeAddress] = _nodeTrust;
            //}
        }
    }
    
    //Function Remove IoTDevice
    function removeNode (address _nodeAddress) public {
        address _fogAddress = msg.sender;
        
        if(fogDeviceMapping[_nodeAddress] != _fogAddress) {
            revert('Sorry! Provided Fog-Node Mapping is Not Correct');
        } else {
            delete iotNodes[_nodeAddress];
            totalIoTDevice--;
        }
    }
    
    //Function Checking Trust
    function verifyTrust(address _nodeAddress) public view returns(uint8 nodeTrust) {
        
        address senderNodeAddress = msg.sender;
        
        if(iotNodes[senderNodeAddress].nodeName == 0) {
            revert('Requesting Node Not Verfied');
        } else if (iotNodes[_nodeAddress].nodeName == 0) {
            revert('Requested Node Not Found');
        } else {
                return (iotNodes[_nodeAddress].nodeTrust);
        }
    }
    
    //Function for comparing strings 
    function compareStrings (string memory a, string memory b)  internal pure returns (bool) {
        if ( keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)) ) {
            return true;
        } 
        else {
            return false;
        }
   }
   
   function sendMessage(address sender, address receiver, string memory message) public commNodes(sender, receiver) 
   {
       messages[receiver] = message;
   }
   
   function readMessage(address receiver) public view checkNode(receiver) returns (string memory)
   {
        return messages[receiver];
   }
   
}
