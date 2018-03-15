const Wallet = require('./wallet/wallet.js');
const ChainUtil = require('./chainUtil.js');

console.log("----------------------- wallet before transaction -------------------------");
let wallet = new Wallet();
console.log(wallet.toString());
console.log('');

console.log("----------------------- The transaction -------------------------");
let trans = wallet.issueTransaction('4ddre55-something-somefakeaddress', 10);
console.log(trans);
console.log('');

console.log("----------------------- Invalid Transaction -------------------------");
let trans2 = wallet.issueTransaction('4ddre55-something-somefakeaddress', 10000);
console.log(trans2);
console.log('');

console.log("----------------------- wallet after transaction -------------------------");
console.log(wallet.toString());
console.log('');

console.log("----------------------- verify integrity of  transaction -------------------------");
//try to tamper transactions
trans.outputs.outputToReciever = 1000;

const signature = trans.input.signature;
const dataHash = ChainUtil.hash(trans.outputs);
const publicKey = wallet.address;

if(ChainUtil.verifySignature(publicKey, signature, dataHash))
   console.log("Transaction is valid.");
else
   console.log("Transaction is invalid");
