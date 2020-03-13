angular.module('app').service('aloneService', aloneService);

aloneService.$inject = [
    'brokerDetails',
    'messageService',
    '$state',
    '$timeout'
    
];


function aloneService(brokerDetails, messageService, $state, $timeout) {
    var self = this;
    // var channel0Occupied = false;
    // var channel1Occupied = false;
    var serviceName = 'alone_service';
    var channelTopic0 = `${brokerDetails.UUID}/channel/0`;
    var channelTopic1 = `${brokerDetails.UUID}/channel/1`;
    var currentTopic = "";
    var otherTopic = "";
    // var channel1Vacant = true;
    // var channel0vacant = true;
    // var hashUUID;
    var currentChannel = -1;
    var otherChannel = -1
    var uuid;
    var DELAY_MS = 1000;
    var weapons = false;
    self.initialize = initialize;
    // self.returnFreeChannels = returnFreeChannels;
    
    self.currentChannel = currentChannel;
    self.otherChannel = otherChannel;
    self.currentTopic = currentTopic;
    self.otherTopic = otherTopic
    self.uuid = uuid;
    self.listenForOthers = listenForOthers;
    self.checkResponse = checkResponse;
    self.checkOtherTrack = checkOtherTrack;
    self.weapons = weapons;
    
    
    
    

    function initialize(hash){
        console.log("Alone service ini");
        uuid = hash;
    }

    function listenForOthers(){
        messageService.subscribe(self.currentTopic, serviceName, function(message){
            if(message.topic == self.currentTopic){
                console.log("hash: " + uuid);
                console.log("message: " + message.payloadString.replace(/"/g,""));
                if(!(uuid==message.payloadString.replace(/"/g,""))){
                    messageService.publish(self.currentTopic, JSON.stringify(uuid));
                }
            }
        });
    }

    function checkResponse(channel){
        currentChannel  = channel;
        self.currentTopic = `${brokerDetails.UUID}/channel/${currentChannel}`;
        console.log("current channel" + self.currentTopic);
        console.log("my UUID: " + uuid);
        var response = false;
        messageService.subscribe(self.currentTopic, serviceName, function(message){
            if(message.topic == self.currentTopic){
                console.log("hash: " + uuid);
                console.log("message: " + message.payloadString.replace(/"/g,""));
                if(!(uuid==message.payloadString.replace(/"/g,""))){
                    response = true;
                }
            }
        });
        messageService.publish(self.currentTopic, JSON.stringify(uuid));
        $timeout(
            function () {
                if(!response){
                    listenForOthers();
                    $state.transitionTo('car_control',
                    {
                    channel: channel,
                    });
                }else{
                    alert("Channel Occupied! Try Another!");
                }
            }, DELAY_MS);
        
    }

    function checkOtherTrack(){
        //console.log(currentChannel);
        if(currentChannel == 1){
            otherChannel = 0;
        }
        if(currentChannel == 0){
            otherChannel = 1;
        }
        self.otherTopic = `${brokerDetails.UUID}/channel/${otherChannel}`;
        console.log("other channel: "+self.otherTopic);

        messageService.subscribe(self.otherTopic, serviceName, function(message){
            if(message.topic == self.otherTopic){
                console.log("hash: " + uuid);
                console.log("message: " + message.payloadString.replace(/"/g,""));
                if(!(uuid==message.payloadString.replace(/"/g,""))){
                    console.log("RESPONSE!");
                    weapons = true;
                    
                }
            }
        });

        messageService.publish(self.otherTopic, JSON.stringify(uuid));
    }

    
}