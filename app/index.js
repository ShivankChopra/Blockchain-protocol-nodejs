const express = require('express');
const Blockchain = require('../blockchain/main.blockchain.js');
const bodyParser = require('body-parser');

const blockchain = new Blockchain();
const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3001;

// for parsing incoming request as json
app.use(bodyParser.json());

// get blockchain
app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

// mine a new block with given data
app.post('/mine', (req, res) => {
  const block = blockchain.addNewBlock(req.body.data);
  res.status(200).send("Added " + block.toString());
});

app.listen(HTTP_PORT, () => {
  console.log(`Started server on port ${HTTP_PORT}.`);
});
