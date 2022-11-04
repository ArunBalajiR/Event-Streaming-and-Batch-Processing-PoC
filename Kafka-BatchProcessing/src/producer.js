const kafka = require('kafka-node');
const defaults = require('../config.js');
const kafkaTopic = process.env.PRODUCER_KAFKA_TOPIC || "v2_kafka_topic";
let producer = kafkaConnection();
const { generateSlug } = require("random-word-slugs");

async function produceEvents(events) {
    const payloads = [];
    events.forEach(function (event) {
        
        payloads.push({"topic": kafkaTopic, "messages": JSON.stringify(event)});
    });
    try {
        await sendMessage(payloads);
    } catch (e) {
        let i = 0;
        let reconnectSuccessful = false;
        while (i < 100) {
            try {
                console.log('Trying to reconnect kafka... ');
                i++;
                await reconnect();
                reconnectSuccessful = true;
                break;
            } catch (e) {
                console.log('Failed to reconnect kafka, retrying...');
                await util.sleep(2000);
            }
        }
        if (!reconnectSuccessful) {
            console.log('Failed to reconnect kafka, exiting...');
            throw new Error('Failed to reconnect kafka')
        } else {
            console.log('reconnected to kafka, exiting...');
            try {
                await sendMessage(payloads);
            } catch (e) {
                console.log('Failed to resend to kafka, exiting...');
                throw new Error('Failed to resend to kafka...')
            }
        }
    }
}


async function sendMessage(payloads) {
    const promise = new Promise(function (resolve, reject) {
        producer.send(payloads, async (err, data) => {
            if (err) {
                console.log('Error while pushing message to kafka topic.', err);
                
                reject();
            }
            if (data) {
                console.info("Produced Message on to es-proxy topic.", JSON.stringify(data));
                resolve(data);
            }
        });
    });
    return promise;
}


function kafkaConnection() {
    const client = new kafka.KafkaClient({
        kafkaHost: defaults.client.options.kafkaHost,
        requestTimeout: defaults.client.options.requestTimeout,
        requireAcks: 1,
        ackTimeoutMs: 100,
        connectRetryOptions: {
            retries: 100
        },
    });

    const producer = new kafka.HighLevelProducer(client);

    producer.on('ready', function () {
        console.log("Kafka producer is connected");
    });

    producer.on('error', async function (err) {
            console.log('Kafka producer is not able to connect', err);
            let i = 0;
            let reconnectSuccessful = false;
            while (i < 100) {
                try {
                    console.log('Trying to reconnect kafka... ');
                    i++;
                    await reconnect();
                    reconnectSuccessful = true;
                    break;
                } catch (e) {
                    console.log('Failed to reconnect kafka, retrying...');
                    await util.sleep(2000);
                }
            }
            if (!reconnectSuccessful) {
                console.log('Failed to reconnect kafka, exiting...');
                process.exit(0);
            } else {
                console.log('reconnected to kafka, exiting...');
            }
        }
    );
    return producer;
}


function reconnect() {
    return new Promise((resolve, reject) => {
        producer.client.refreshMetadata([kafkaTopic], (err) => {
            console.log("Refreshing metadata to attempt producer reconnect");
            if (err) {
                console.log("Error occurred while refreshing metadata for producer", err);
                reject();
            } else {
                console.log("Successfully reconnected.....");
                resolve();
            }
        });
    });
}

function produceBatch(){
    const batch = [];
    for(var i=0;i<10;i++){
        const songID = Math.floor(Math.random()*1024)+1;
        const songTitle = getRandomWord();
        const songInfo = { songID, songTitle};
        batch.push(songInfo);
    }
    return batch;
    
}

function produceSingle(){
    const songID = Math.floor(Math.random()*1024)+1;
    const songTitle = getRandomWord();
    const songInfo = { songID, songTitle};
    return songInfo;
    
}

function getRandomWord() {
    const slug = generateSlug(4, { format: "title" });
    return slug;
}


setInterval(() => {
    // const myList = produceBatch();
    // produceEvents(myList);
    produceEvents([produceSingle()]);
  }, 3000);
  