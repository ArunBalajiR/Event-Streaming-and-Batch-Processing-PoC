import { Kafka } from 'kafkajs';

async function createPartition() {
    const kafka = new Kafka({
        clientId: "oddOrEven",
        brokers: ["127.0.0.1:9092"],
    });

    const admin = kafka.admin();
    await admin.connect();

    await admin.createTopics({
        topics: [
            {
                topic: "numbers4",
                numPartitions: 2,
            },
        ],
    });
    console.log("2 Partitions created");
    await admin.disconnect();
}

createPartition();