/**
 * 
 * this is old version.  2020 timeframe.
 * 
 * example for hcs
 * - create hcs topic
 * - get receipt of the topic
 * - subscribe to topic from a mirror node
 * - send message to a topic
 * 
 * 
 * this is from video: Coding With Cooper - Get started with the Hedera Consensus Service - JavaScript
 * https://www.youtube.com/watch?v=hBoLY88tdoE
 * 
 */

require("dotenv").config();

const { Client, MirrorClient, MirrorConsensusTopicQuery, ConsensusTopicCreateTransaction, ConsensusMessageSubmitTransaction } = require("@hashgraph/sdk");

async function main() {
    const myClient = Client.forTestnet();

    myClient.setOperator(process.env.OPERATOR_ID, process.env.OPERATOR_KEY);

    // create new topic
    const transactionId = await new ConsensusTopicCreateTransaction().execute(myClient);
    // get receipt to see the topicid created
    const transactionReceipt = await transactionId.getReceipt(myClient);
    const topicId = transactionReceipt.getConsensusTopicId();

    console.log("topic id = ", topicId);


    // by sleeping for some time, the mirror node are more likely to be have that topic already.
    await sleep(10000);

    const myMirrorClient = new MirrorClient("hcs.testnet.mirrornode.hedera.com:5600");

    new MirrorConsensusTopicQuery()
        .setTopicId(topicId)
        .subscribe(
            myMirrorClient, 
            (message) => {
                console.log("receive message from mirror node: ", message.toString());
            },
            (error) => {
                console.log(`error: ${error.toString()}`);
            },
        )

    // send 10 messages
    for (let i = 0; i < 10; i++) {
        let hcsMessage = await new ConsensusMessageSubmitTransaction().setTopicId(topicId).setMessage(`hello, hcs! from message ${i}`).execute(myClient);

        let hcsMessageReceipt = await hcsMessage.getReceipt(myClient);

        console.log(`sent message ${i}: ${hcsMessageReceipt.toString()}`);
    }

}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

main();