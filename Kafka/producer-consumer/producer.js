import { Kafka } from 'kafkajs';
import eventType from './eventType.js';
import { generateSlug } from "random-word-slugs";

const kafka = new Kafka({
    clientId: "myKafka",
    brokers: ["127.0.0.1:9092"],
});

const stream = kafka.producer();
await stream.connect();


function queueRandomMessage() {
  const sno = Math.floor(Math.random() * 25)+1;
  const title = getRandomWord();
  const event = { sno, title };
  const success = stream.send({
    topic: "test",
    messages: [
        {
            value: eventType.toBuffer(event)
        }
    ]
  });     
  if (success) {
    console.log(`message queued (${JSON.stringify(event)})`);
  } else {
    console.log('Too many messages in the queue already..');
  }
}

function getRandomWord() {
    const slug = generateSlug(4, { format: "title" });
    return slug;
}

setInterval(() => {
  queueRandomMessage();
}, 3000);
