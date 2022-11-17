const kafkaHost = process.env.KAFKA_HOST || "localhost:9092";
const sessionTimeOut = process.env.KAFKA_REQUEST_TIME_OUT || 30000;
const consumerGroup = process.env.CONSUMER_GROUP || 'consumer-group-1';

const kafkaConfig = {
    client: {
        options: {
            kafkaHost: kafkaHost, // A string of kafka broker/host combination delimited by comma for example: kafka-1.us-east-1.myapp.com:9093,kafka-2.us-east-1.myapp.com:9093,kafka-3.us-east-1.myapp.com:9093 default: localhost:9092.
            connectTimeout: 10000, // in ms it takes to wait for a successful connection before moving to the next host default: 10000
            requestTimeout: sessionTimeOut, // in ms for a kafka request to timeout default: 30000
            autoConnect: true, // automatically connect when KafkaClient is instantiated otherwise you need to manually call connect default: true
            idleConnection: 300000, // object hash that applies to the initial connection. see retry module for these options.
            maxAsyncRequests: 10, // maximum async operations at a time toward the kafka cluster. default: 10
            sslOptions: undefined, /// Object, options to be passed to the tls broker sockets, ex. { rejectUnauthorized: false } (Kafka 0.9+)
            sasl: undefined ,// Object, SASL authentication configuration (only SASL/PLAIN is currently supported), ex. { mechanism: 'plain', username: 'foo', password: 'bar' } (Kafka 0.10+)
            groupId: consumerGroup,//consumer group id, default `kafka-node-group`
            // Auto commit config
            autoCommit: false,
            // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
            fetchMaxWaitMs: 100,
            // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
            fetchMinBytes: 1,
            // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
            fetchMaxBytes: 1024, // [SNS,SQS]=256K, DynamoDB=400K, Kinesis=1MB
            // If set true, consumer will fetch message from the given offset in the payloads
            fromOffset: 'latest',
            // If set to 'buffer', values will be returned as raw buffer objects.
            encoding: 'utf8',
            keyEncoding: 'utf8'
        }
    },
    MAX_MESSAGE: 5
};

export default kafkaConfig;