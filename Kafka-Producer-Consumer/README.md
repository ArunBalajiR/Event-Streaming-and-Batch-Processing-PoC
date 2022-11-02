## Steps to Execute

1) `docker-compose up`
2) Run producer and consumer using `npm start:producer` and `npm start:consumer`.


--- 

## Additional Commands

View topic messages

```
docker exec -it kafka /opt/bitnami/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --from-beginning \
  --topic test

```

Push topic messages
```
docker exec -it kafka /opt/bitnami/kafka/bin/kafka-console-producer.sh \
    --broker-list localhost:9092 \
    --topic test

```

Start Kafka

```
docker-compose rm -svf
docker-compose up

```

