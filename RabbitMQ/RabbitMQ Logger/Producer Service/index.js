import express from 'express';
const app = express();
import Producer from './producer.js';

const producer = new Producer();

app.use(express.json("application/json"));

app.post("/sendLog", async (req, res, next) => {
  await producer.publishMessage(req.body.logType, req.body.message);
  res.send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Logger Service started and Listening on port ${PORT}`);
});
