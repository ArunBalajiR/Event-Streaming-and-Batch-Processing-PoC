import { Kafka } from 'kafkajs';

async function createPartition() {
    const kafka = new Kafka({
        clientId: "myKafka",
        brokers: ["127.0.0.1:9092"],
    });

    const admin = kafka.admin();
    await admin.connect();

    await admin.createTopics({
        topics: [
            {
                topic: "test",
                numPartitions: 1,
            },
        ],
    });
    console.log("1 Partition and topic test was created");
    await admin.disconnect();
}

createPartition();