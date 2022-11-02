const textract = require('textract');
const express = require('express');
const bodyParser = require('body-parser');
const Consumer = require('./consumer');
const mongoose = require('mongoose');

var app = express()
app.use(bodyParser.json("application/json"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const DB = process.env.MONGO_CONNECTION_STRING.replace(
    "<password>",
    process.env.MONGODB_PASSWORD
  );

// socket
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// socket connection
io.on("connection", (socket) => {
  console.log(`Socket connected witth id : ${socket.id}`);
  
});



const connect = () => {
    mongoose
        .connect(DB)
        .then(() => {
        console.log("Mongo Connected Succesfully");
        })
        .catch((err) => {
          console.log(err);
          io.emit("logs","Problem while storing in MongoDB");
          // throw err;
        });
};
        

const PORT = 3000;
server.listen(PORT, async ()=>{
    console.log("Connect Socket listen");
    setTimeout(async function () {
      await connect();
    await start('amqps://opaspkhj:QQQQSWBcoYXzxnnZcs2Zjws785JAuX1V@mustang.rmq.cloudamqp.com/opaspkhj', 'urls',io);
    console.log(`Connected and server listening on port ${PORT}`);
  }, 5000);
    
})


function consumeAction (msg) {
  if (msg !== null) {
    // console.log('consumed msg: ',msg.content.toString())
    console.log("Consumed in Message Queue");
    
  }
}


async function start (connectionString, queueName,io) {
  let consumer = new Consumer(connectionString, queueName,io)

  try {
    await consumer.waitForConnection(1000)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }

  await consumer.start(consumeAction)
}




