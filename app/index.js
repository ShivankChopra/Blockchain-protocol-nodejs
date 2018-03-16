const express = require('express');
const Blockchain = require('../blockchain/main.blockchain.js');
const P2pServer = require('./p2p-server.js');
const bodyParser = require('body-parser');
const Wallet = require('../wallet/wallet.js');
const TransactionPool = require('../wallet/transaction-pool.js');

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, transactionPool);
const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3001;

// for parsing incoming request as json
app.use(bodyParser.json());

// get blockchain
app.get('/blocks', (req, res) => {
  res.json(p2pServer.blockchain.chain);
});

// mine a new block with given data
app.post('/mine', (req, res) => {
  p2pServer.blockchain.addNewBlock(req.body.data);
  p2pServer.syncronizeChain();
  res.status(200).send("Syncronized chain on all peers");
});

// issue a new transaction
app.post('/transact', (req, res) => {
  const {address, amount} = req.body;
  const transaction = wallet.issueTransaction(address, amount, transactionPool);
  p2pServer.broadcastTransaction(transaction);
  res.status(200).json(transaction);
});

// get unverified transactions held by network
app.get('/unverifiedTransactions', (req, res) => {
  res.status(200).json(transactionPool);
});

// get public key / address of the Wallet
app.get('/publicKey', (req, res) => {
  res.status(200).send(wallet.address);
});

app.listen(HTTP_PORT, () => {
  console.log(`Started server on port ${HTTP_PORT}.`);
});

p2pServer.listen();
