const SHA256 = require('crypto-js/sha256');

class Block{
  // Initialize block's properties
  constructor(timestamp, lastHash, hash, data){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  // Util function to convert block to string
  toString(){
    return `Block-

            Timestamp: ${this.timestamp}
            LastHash : ${this.lastHash}
            Hash     : ${this.hash}
            Data     : ${this.data} `;
  }

  // statically create genesis block
  static createGenesisBlock(){
    return new this('Shivanks Time!', '--N-A--', 'Genesis Block', 'Sh1v4nk0017');
  }

  // creates a new block using a given (previous) block and new data
  static mineBlock(lastBlock, data){
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);

    return new this(timestamp, lastHash, hash, data);
  }

  // generate hash for a block
  static hash(timestamp, lastHash, data){
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }

  // returns hash of given block for verification purpose
  static getBlockHash(block){
    return this.hash(block.timestamp, block.lastHash, block.data);
  }

}

module.exports = Block;
