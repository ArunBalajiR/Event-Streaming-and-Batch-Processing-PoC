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
  res.send("Subscriber One")
})

const PORT = 5551;
app.listen(PORT, () => {
  console.log(`Subscriber One  Listening on port ${PORT}`);
})