import  express from 'express';
import bodyParser from 'body-parser';
const app = express()
app.use(bodyParser.json());
import { createClient } from 'redis';

const client = createClient();
const publisher = client.duplicate();

publisher.connect();
app.post("/publish", (req, res) => {
  const id = Math.floor(Math.random()*10 +1);
  const myData = req.body;
  myData.id = id;
  publisher.publish("user-notify", JSON.stringify(myData));
  res.send("Publishing an Event using Redis")
})
const PORT = 4444;
app.listen(PORT, () => {
  console.log(`Producer Listening on port ${PORT}`);
})
