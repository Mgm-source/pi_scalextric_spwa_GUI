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
    // var channel1Vacant = true;
    // var channel0vacant = true;
    // var hashUUID;
    var currentChannel = -1;
    var uuid;
    var DELAY_MS = 1000;
    self.initialize = initialize;
    // self.returnFreeChannels = returnFreeChannels;
    
    self.currentChannel = currentChannel;
    self.currentTopic = currentTopic;
    self.uuid = uuid;
    self.listenForOthers = listenForOthers;
    self.checkResponse = checkResponse;
    
    
    
    

    function initialize(hash){
        console.log("Alone service ini");
        uuid = hash;
        // hashUUID = hash;
        // messageService.publish(channelTopic0, JSON.stringify(hash));
        // messageService.publish(channelTopic1, JSON.stringify(hash));

        // // messageService.subscribe(channelTopic0, serviceName, function(message){
        // //     if(message.topic == channelTopic0){
        // //         console.log("hash: " + hash);
        // //         console.log("message: " + message.payloadString.replace(/"/g,""));
        // //         if(!(hash===message.payloadString.replace(/"/g,""))){
        // //             channel0vacant = false;
        // //             console.log("channel 0 is vacant: "+channel0vacant);
        // //         }
        // //     }
        // // });

        // // messageService.subscribe(channelTopic1, serviceName, function(message){
        // //     if(message.topic == channelTopic1){
        // //         console.log("hash: " + hash);
        // //         console.log("message: " + message.payloadString.replace(/"/g,""));
        // //         if(!(hash===message.payloadString.replace(/"/g,""))){
        // //             channel1vacant = false;
        // //             console.log("channel 1 is vacant: "+channel1vacant);
        // //         }
        // //     }
        // // });

        // messageService.subscribe(channelTopic0, serviceName, function(message){
        //     if(message.topic == channelTopic0){
        //         console.log("hash: " + hash);
        //         console.log("message: " + message.payloadString.replace(/"/g,""));
        //         if(!(hash==message.payloadString.replace(/"/g,""))){
        //             messageService.publish(channelTopic0, JSON.stringify(hash));
        //             console.log(currentChannel);
        //         }
        //     }
        // });
        
    }

    // function tryChannel(channel){
    //     currentChannel  = channel;
    //     self.currentTopic = `${brokerDetails.UUID}/channel/${currentChannel}`;
    //     console.log("current channel" + self.currentTopic);
    //     console.log("my UUID: " + uuid);
    //     messageService.publish(self.currentTopic, JSON.stringify(uuid));
    //     $state.transitionTo('car_control',
    //                 {
    //                 channel: 0,
    //                 });
    // }

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
   
}