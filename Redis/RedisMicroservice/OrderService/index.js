import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from 'redis';
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));

const client = createClient();
const publisher = client.duplicate();
await publisher.connect();
const subscriber = client.duplicate();
await subscriber.connect();



const food = {
    "burger": 150,
    "chicken": 120,
    "egg": 50,
    "rice": 1000
};

app.post('/order',async (req,res)=>{
    const { order } = req.body;
    if(!order.name || !order.quantity){
        return res.status(404).json({
            message: "Order name or Quantity missing"
        })
    }

    let receipt = {
        name : order.name,
        quantity: order.quantity,
        totalPrice: order.quantity * food[order.name]
    }

    publisher.publish("NEW_ORDER",JSON.stringify(receipt));
    await subscriber.subscribe("ORDER_SUCCESS",(message)=>{
        console.log(message);
        receipt["amountRemainingInWallet"] = message.amountRemainingInWallet;
        return res.status(404).send({ message: message.message, receipt });
    });

    await subscriber.subscribe("ORDER_FAIL",(error)=>{
        return res.status(404).send(error);
    });

})


const PORT = 4500;
app.listen(PORT,()=>{
    console.log(`Order Service running on port ${PORT}`);
})