const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Producer = require('./producer');
app.use(bodyParser.json("application/json"));


function startWebServer (producer) {
    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
  
  
    app.post('/sendData', async (req, res) => {
      console.log(`Sent to Message Queue\n\n"${JSON.stringify(req.body, null, '\t')}"`)
      producer.produce(req.body)
      res.send({
        message : "Added to MessageQueue",
      });
    })
  
    const PORT = 3500;
    app.listen(3500, ()=>{
        console.log(`App Listening on port ${PORT}`);
    })
}

async function start (connectionString, queueName) {
  let producer = new Producer(connectionString, queueName)

  try {
    await producer.waitForConnection(1000)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }

  startWebServer(producer)
}

start("amqps://opaspkhj:QQQQSWBcoYXzxnnZcs2Zjws785JAuX1V@mustang.rmq.cloudamqp.com/opaspkhj", 'urls')