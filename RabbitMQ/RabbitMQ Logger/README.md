![Image](rabbitmq.png "Pub/Sub")

Instructions

1. Trigger the RabbitMQ docker cluster using `docker-compose up` (In root folder)
   we can moniter rabbitMQ log screen in `http://localhost:15672/` Username: guest Password : guest

2. Run Producer Service using `npm start` inside *Producer Service* folder and send post request to `http://localhost:3000/sendLog`
   along with body 
   
   ```
    {
        "logType" : "Error",
        "message": "Successful ..!"
    }
   ```

3. Run Both consumer using `npm start` inside respective folder.
   *Info Consumer* and *WarningError Consumer*


### Deadletter Exchanges

Messages from a queue can be "dead-lettered"; that is, republished to an exchange when any of the following events occur:

The message is negatively acknowledged by a consumer using basic.reject or basic.nack with requeue parameter set to false.
The message expires due to per-message TTL; or
The message is dropped because its queue exceeded a length limit

Run Instructions : 

 1 . Run the `producer.js` along with arguments to send.

      node producer.js Hi, goodmorning! 
      
2 . Run the `npm start`.