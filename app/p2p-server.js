const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
// Hold peers (as array) as specified in run command. (',' seperated addresses of peers eg. ws://localhost:5001,.. )
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer{
  constructor(blockchain){
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen(){
    const server = new Websocket.Server({port : P2P_PORT});
    server.on('connection', socket => {this.connectSocket(socket)});
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
    this.messageHandler(socket);
    this.sendChainTo(socket);
  }

  sendChainTo(socket){
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  messageHandler(socket){
    socket.on('message', message => {
      const recievedChain = JSON.parse(message);
      this.blockchain.replaceChain(recievedChain);
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
}

module.exports = P2pServer;
