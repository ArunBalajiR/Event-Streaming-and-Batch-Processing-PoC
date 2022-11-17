const amqp = require('amqplib');
const { get } = require('mongoose');
const textract = require('textract');
const Detail = require('./models/Detail.js');

class Consumer {
  constructor (connectionString, queueName,io) {
    this.connectionString = connectionString
    this.queueName = queueName
    this.io = io
    this.connection = null
    this.channel = null
    this.retry = 0
  }

  async waitForConnection (interval = 1000, maxRetry) {
    console.log('... connecting to Queue ...')

    if (maxRetry > 0) {
      if (this.retry > maxRetry) {
        throw new Error('Exceeded Max Retry. Exiting ...')
      }
      this.retry++
    }

    try {
      await this.connect()
      console.log('... connected to Queue ...')
    } catch (err) {
      console.log('Could not connect to Queue, retrying...')
      await this.wait(interval)
      await this.waitForConnection(maxRetry)
    }
  }

  async wait (time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  async connect () {
    this.connection = await amqp.connect(this.connectionString)
    this.channel = await this.connection.createChannel()
    await this.channel.assertQueue(this.queueName)

    return null
  }

  async disconnect () {
    await this.channel.close()
    await this.connection.close()
  }

  async produce (message) {
    if (!this.channel) {
      throw new Error('There is no connection to Queue')
    }

    await this.channel.sendToQueue(this.queueName, Buffer.from(message))
  }

  async start (doForEveryItem) {
    this.channel.consume(this.queueName, (msg) => {
      doForEveryItem(msg)
      this.getOcr(msg).then(response => {
        console.log(response.slice(0,75)+"...SEE MORE IN DB");
        this.channel.ack(msg);
        this.addDetail(response,msg.content.toString());
      }).catch(err => {

        console.log(err);
        this.io.emit("logs",err);
      });
    })
  }

  getOcr(data){
    return new Promise((resolve,reject) => {
        const url =  JSON.parse(data.content.toString()).documentUrl;
        textract.fromUrl(url, (error, text) => {
          if (error) {
              reject(error);
          } else {
              resolve(text);
          }
        });
    })
  }

  async addDetail(finalText,jsonData){
    const data = JSON.parse(jsonData);
    data.documentContent = finalText;
    const newDetail = new Detail(data);
    try{
        const nDetail = await newDetail.save();
        console.log("Saved to DB");
        this.io.emit("logs","Successfull Operation !")
        
    }catch(err){
        this.io.emit("logs",err);
    }
  }
  
}

module.exports = Consumer