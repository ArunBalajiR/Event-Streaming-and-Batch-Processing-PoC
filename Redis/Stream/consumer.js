import  Redis  from "ioredis";

const redis = new Redis();

const STREAMS_KEY = "v3_Stream";
const GROUP_NAME = "v3_Group";
var CONSUMER_ID = "consumer:1"

await redis.xgroup('CREATE', STREAMS_KEY, GROUP_NAME, '0', 'MKSTREAM')
    .catch((err) => {
      console.error(`Group already exists error: ${err}`);
});


async function consumeMessages(){
    const message = await redis.xreadgroup('GROUP', GROUP_NAME, CONSUMER_ID, 'COUNT', 1, 'STREAMS', STREAMS_KEY, '>');
if (message) {
    var messages = message[0][1]; 
    // print all messages
    messages.forEach(function(message){
        // convert the message into a JSON Object
        var id = message[0];
        var values = message[1];
        var msgObject = { id : id};
        for (var i = 0 ; i < values.length ; i=i+2) {
            msgObject[values[i]] = values[i+1];
        }                    
        console.log(JSON.stringify(msgObject,null, 2));
        
    });
    
} else {
    // No message in the consumer buffer
    console.log("No new message...");
}


}
setInterval(() => {
    consumeMessages();
  }, 1000);

