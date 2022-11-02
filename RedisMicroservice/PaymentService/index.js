import express, { application } from 'express';
import redis from 'redis';
import { createClient } from 'redis';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const client = createClient();
const subscriber = client.duplicate();
await subscriber.connect();
const publisher = client.duplicate();
await publisher.connect();

let wallet = 10000;
subscriber.subscribe("NEW_ORDER", (data)=>{
    console.log(data);
    const { name, quantity, totalPrice } = JSON.parse(data);
    if (totalPrice < wallet) {
        wallet -= totalPrice;
        publisher.publish("ORDER_SUCCESS", JSON.stringify({ message: "Order placed", amountRemainingInWallet: wallet }));
    } else {
        publisher.publish("ORDER_FAIL", JSON.stringify({ error: "Low on wallet money" }));
    }
})
const PORT = 5500;
app.listen(PORT,()=>{
    console.log(`Payment Service Listening on port ${PORT}`);
})