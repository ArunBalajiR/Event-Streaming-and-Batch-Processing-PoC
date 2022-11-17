import kafka from 'kafka-node';
import kafkaConfig from './config.js';
import moment from 'moment';
import { generateSlug } from 'random-word-slugs';

const kafkaTopic = process.env.CONSUMER_KAFKA_TOPIC || "v2_kafka_topic";

// init consumer
let consumer = new kafka.ConsumerGroup(kafkaConfig.client.options, kafkaTopic);

async function consumeBatch(){
    let myConsumedList = [];
    consumer.on('message',async function(message){
        myConsumedList.push(message);
        console.log(`Batch consists of ${myConsumedList.length} of 5`);
        
        if(myConsumedList.length >= kafkaConfig.MAX_MESSAGE){
            console.log("Batch limit reached. Consumer is paused and Batch Processing begins..");
            consumer.pause();
            const processedList = await processtheBatch(myConsumedList);
            
            console.log("-----------BATCH PROCESSED AND SAVED TO DB-----------");
            console.table(processedList);
            await emptyBatch(myConsumedList);
            commitAndResume();


        }else{
            console.debug(`Messaged added to batch - partition: ${message.partition} offset: ${message.offset}`);
        }
    });

    consumer.on('error', async err => {
        console.error("Error while reading message from Kafka topic ", err);
        console.error("Error Details", JSON.stringify(err));
        if (err) {
            console.error("Received error in consumer.. attempting reconnect", err);

            let i = 0;
            let reconnectSuccessful = false;
            while (i < 100) {
                try {
                    console.info('Trying to reconnect kafka... ');
                    i++;
                    await reconnect();
                    reconnectSuccessful = true;
                    break;
                } catch (e) {
                    console.error('Failed to reconnect kafka, retrying...');
                    await util.sleep(2000);
                }
            }
            if (!reconnectSuccessful) {
                console.error('Failed to reconnect kafka, exiting...');
                process.exit(0)
            }
        }
    });
}

async function emptyBatch(batch){
    batch.length = 0;
}

async function processtheBatch(arr){
    console.log("-----------PROCESSING THE BATCH-----------");
    let unprocessed = [];
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        
        for (var key in obj) { 
          if(key === 'value'){
            unprocessed.push(JSON.parse(obj[key]));
          }
          
        }
        
      }
      console.table(unprocessed);
    let processed = []; 
    await arr.forEach(batchItem => {
        
        let obj = JSON.parse(batchItem.value);
        obj.releaseDate = moment().format('ll'); 
        obj.lastUpdated = moment().format();
        obj.album = generateSlug(1, {format: "title"});
        processed.push(obj);
        // console.log("OBJ2"+JSON.stringify(obj));
        
    });
    return processed;
}


function reconnect() {
    return new Promise((resolve, reject) => {
        consumer.client.refreshMetadata([kafkaTopic], (err) => {
            console.info("Refreshing metadata to attempt producer reconnect");
            if (err) {
                console.error("Error occurred while refreshing metadata for producer", err);
                reject();
            } else {
                console.info("Successfully reconnected.....");
                resolve();
            }
        });
    });
}


function commitAndResume() {
    consumer.commit(function (error, data) {
        console.info(`SUCCESS in committing DATA: ${JSON.stringify(data)}`);
        console.warn('The batch is empty, resuming !');
        if (!error) {
            console.info('Consumer is resumed.Start consuming data again...');
            consumer.resume();
        } else {
            console.error(`Failed to commit messages!`, error);
        }
    });
}

consumeBatch();
