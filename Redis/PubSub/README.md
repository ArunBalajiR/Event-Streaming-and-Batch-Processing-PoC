## Redis Pub/Sub 

![Image](redispubsub.png "Pub/Sub")

Step 1 : Run Redis docker container <br>
    `docker run --name redispubsub -p 6379:6379 -d redis`

Step 2 : Start the publisher using `npm start`<br>
Step 3 : Start both the subscribers using `npm start`

### Result
![Image](redispubsubout.png "Pub/Sub")