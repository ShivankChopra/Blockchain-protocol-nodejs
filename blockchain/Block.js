const SHA256 = require('crypto-js/sha256');

class Block{

  constructor(timestamp, lastHash, hash, data){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString(){
    return `Block-

            Timestamp: ${this.timestamp}
            LastHash : ${this.lastHash}
            Hash     : ${this.hash}
            Data     : ${this.data} `;
  }

  static createGenesisBlock(){
    return new this('Shivanks Time!', '--N-A--', 'Sh1v4nk0017', 'A secret message to future users');
  }

  static mineBlock(lastBlock, data){
    const timestamp = Date.now();
    const lastHash = lastBlock.hash();
    const data = data;
    const hash = Block.hash(timestamp, lastHash, data);

    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp, lastHash, data){
    return SHA256(`${timestamp}${lastHash}${data}`);
  }

}

module.exports = Block;
