const ChainUtil = require('../chainUtil.js');

// number of zeros hash should begin with
const DIFFICULTY = 4;

class Block{
  // Initialize block's properties
  constructor(timestamp, lastHash, hash, data, nonce){
    this.nonce = nonce;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  // Util function to convert block to string
  toString(){
    return `Block-
            Nonce    : ${this.nonce}
            Timestamp: ${this.timestamp}
            LastHash : ${this.lastHash}
            Hash     : ${this.hash}
            Data     : ${this.data} `;
  }

  // statically create genesis block
  static createGenesisBlock(){
    return new this('Shivanks Time!', '--N-A--', 'Genesis Block', 'Sh1v4nk0017', 0);
  }

  // creates a new block using a given (previous) block and new data
  static mineBlock(lastBlock, data){
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let nonce = lastBlock.nonce;

    do{
      nonce ++;
      timestamp = Date.now();
      hash = Block.hash(timestamp, lastHash, data, nonce);
    }while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

    return new this(timestamp, lastHash, hash, data, nonce);
  }

  // generate hash for a block
  static hash(timestamp, lastHash, data, nonce){
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}`);
  }

  // returns hash of given block for verification purpose
  static getBlockHash(block){
    return this.hash(block.timestamp, block.lastHash, block.data, block.nonce);
  }

}

module.exports = Block;
