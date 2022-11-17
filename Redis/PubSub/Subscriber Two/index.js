import express from 'express';
import { createClient } from 'redis';
const client = createClient();

const subscriber = client.duplicate();
await subscriber.connect();
const app = express();

await subscriber.subscribe("user-notify", (message) => {
  console.log("Received data :" + message);
  
})

app.get("/", (req, res) => {
  res.send("Subscriber Two")
})

const PORT = 5552;
app.listen(PORT, () => {
  console.log(`Subscriber Two  Listening on port ${PORT}`);
})