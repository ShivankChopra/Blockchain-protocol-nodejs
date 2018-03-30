const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
// Hold peers (as array) as specified in run command. (',' seperated addresses of peers eg. ws://localhost:5001,.. )
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

// utility to store message types that could be sent to sockets
const MESSAGE_TYPE = {
  chain : 'CHAIN',
  transaction : 'TRANSACTION',
  clear : 'CLEAR'
};

class P2pServer{
  constructor(blockchain, transactionPool){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen(){
    // start new server on default/specified port
    const server = new Websocket.Server({port : P2P_PORT});

    // connect to a socket on connection event
    server.on('connection', socket => {this.connectSocket(socket)});

    // connect to specified peers
    this.connectToPeers();
  }

  connectToPeers(){
    PEERS.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  connectSocket(socket){
    this.sockets.push(socket);
    console.log("Socket connected");

    // handle incoming transaction pool or chain
    this.messageHandler(socket);

    // send it's chain to other sockets
    this.sendChainTo(socket);
  }

  sendChainTo(socket){
    socket.send(JSON.stringify({
      type : MESSAGE_TYPE.chain,
      chain: this.blockchain.chain
    }));
  }

  sendTransactionTo(socket, transaction){
    socket.send(JSON.stringify({
      type : MESSAGE_TYPE.transaction,
      transaction: transaction
    }));
  }

  sendClear(socket){
    socket.send(JSON.stringify({
      type : MESSAGE_TYPE.clear,
    }));
  }

  messageHandler(socket){
    socket.on('message', message => {
      const messageObj = JSON.parse(message);

      if(messageObj.type == MESSAGE_TYPE.chain){
        this.blockchain.replaceChain(messageObj.chain);
      }

      if(messageObj.type == MESSAGE_TYPE.transaction){
        this.transactionPool.addNewTransaction(messageObj.transaction);
      }

      if(messageObj.type == MESSAGE_TYPE.clear){
        this.transactionPool.clear();
      }

    });
  }

  syncronizeChain(){
    this.sockets.forEach(socket => {
      if(socket.readyState === Websocket.OPEN){
        this.sendChainTo(socket);
      }
      else {
        console.log('Socket: ' + socket._socket + ' is closed!');
      }
    });
  }

  broadcastTransaction(transaction){
    this.sockets.forEach(socket => {
      if(socket.readyState === Websocket.OPEN){
        this.sendTransactionTo(socket, transaction);
      }
      else {
        console.log('Socket: ' + socket._socket + ' is closed!');
      }
    });
  }

  broadcastClear(){
    this.sockets.forEach(socket => {
      if(socket.readyState === Websocket.OPEN){
        this.sendClear(socket);
      }
      else {
        console.log('Socket: ' + socket._socket + ' is closed!');
      }
    });
  }
}

module.exports = P2pServer;
