### Redis Microservice Communication Example
---

![Image](redisms.png "Pub/Sub")


Step 1 : Run Redis docker container <br>
    `docker run --name redispubsub -p 6379:6379 -d redis`

Step 2 : Start the Order service inside `OrderService` directory using `npm start`<br>
Step 3 : Start payment service inside `PaymentService` directory  using `npm start`
