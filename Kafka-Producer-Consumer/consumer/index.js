import { Kafka } from 'kafkajs';
import eventType from '../eventType.js';
const kafka = new Kafka({
    clientId: "myKafka",
    brokers: ["127.0.0.1:9092"],
});

const consumer = kafka.consumer({ groupId : "test groud"});
await consumer.connect();
console.log("Consumer Connected")

await consumer.subscribe({
    topic: "test",
    fromBeginning: true,
});

await consumer.run({
    eachMessage: async ({ topic,partition,message})=>{
        console.log(`${eventType.fromBuffer(message.value)}`);
        
        
    }
})
