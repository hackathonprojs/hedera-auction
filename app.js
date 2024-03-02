require("dotenv").config();
const express = require('express')
const {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");



// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(myAccountId, myPrivateKey);


let topicId;



async function startAuction() {
  // Create a new topic
  let txResponse = await new TopicCreateTransaction().execute(client);

  // Grab the newly generated topic ID
  let receipt = await txResponse.getReceipt(client);
  topicId = receipt.topicId;
  console.log(`Your topic ID is: ${topicId}`);

  // Wait 5 seconds between consensus topic creation and subscription creation
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Create the topic
  new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
      let messageAsString = Buffer.from(message.contents, "utf8").toString();
      messageProcessor(messageAsString);
      console.log(
        `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
      );
    });

  // // Send message to topic
  // let sendResponse = await new TopicMessageSubmitTransaction({
  //   topicId: topicId,
  //   message: "Hello, HCS!",
  // }).execute(client);
  // const getReceipt = await sendResponse.getReceipt(client);

  // // Get the status of the transaction
  // const transactionStatus = getReceipt.status;
  // console.log("The message transaction status: " + transactionStatus.toString());

  sendMsg(topicId, "Auction starts.");

  //send10Bid(topicId);

  return topicId;
}

/**
 * since hcs allows us to send generic unformatted messages.  
 * we will need to define the message structure and process accordingly.  
 * reject the incorrect messages to maintain the integrity of consensus.  
 * we will ignore the incorrect messages.  
 * those are not part of our internal consensus of how auction is run.  
 * @param {*} message 
 */
function messageProcessor(message) {
  // this is for after-hackathon.
}

async function sendMsg(topicId, message) {
  // Send message to topic
  let sendResponse = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: message,
  }).execute(client);
  const getReceipt = await sendResponse.getReceipt(client);

  // Get the status of the transaction
  const transactionStatus = getReceipt.status;
  console.log("The message transaction status: " + transactionStatus.toString());
}

async function sendBid(topicId, amount) {
  sendMsg(topicId, `bid amount ${amount}`);
}

/**
 * send 10 bids for testing
 * @param {*} topicId 
 */
async function send10Bid(topicId) {
  for (let i = 0; i < 10; i++) {
    // let sendResponse = await new TopicMessageSubmitTransaction({
    //   topicId: topicId,
    //   message: `bid amount ${i}`,
    // }).execute(client);
    // const getReceipt = await sendResponse.getReceipt(client);
  
    // // Get the status of the transaction
    // const transactionStatus = getReceipt.status;
    // console.log("The message transaction status: " + transactionStatus.toString());

    sendBid(topicId, i);

    
    await sleep(1000);
  }
}

async function main() {
  await startAuction();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();



// ---------------------------------

const app = express()
const port = 3000

app.get('/bid', (req, res) => {
  let amount = req.query.amount || 10;
  sendBid(topicId, amount);
  res.send(`bid ${amount}`)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})


