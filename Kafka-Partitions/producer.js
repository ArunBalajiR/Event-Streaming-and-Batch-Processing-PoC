const { Kafka } = require("kafkajs");

async function produce() {
    const kafka = new Kafka({
        clientId: "oddOrEven",
        brokers: ["127.0.0.1:9092"],
    });

    const number = Math.floor(Math.random()*10 +1);

    const producer = kafka.producer();
    await producer.connect();
    console.log("Producer connected");

    const wordNumbers = {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten"
    };

    const producedData = await producer.send({
        topic: "numbers",
        messages: [
            {
                value: wordNumbers[number],
                partition: number%2==0 ? 0 : 1,
            },
        ],
    });
    // console.log(`Produced data ${JSON.stringify(producedData)}`);
    console.log(`Produced Random Number ${number}`);
}

produce()

setInterval(() => {
    produce();
  }, 3000);
  