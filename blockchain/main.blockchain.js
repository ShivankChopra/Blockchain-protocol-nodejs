const Block = require('./Block.js');

class Blockchain{
  constructor(){
    this.chain = [Block.createGenesisBlock()];
  }

  addNewBlock(data){
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
    return block;
  }

  isChainValid(chain){
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.createGenesisBlock()))
       return false;

    for(let i = 1; i < chain.length; i++){
      const currentBlock = chain[i];
      const prevBlock = chain[i-1];

      if(prevBlock.hash !== currentBlock.lastHash || currentBlock.hash !== Block.getBlockHash(currentBlock))
         return false;
    }
    
    return true;
  }

  replaceChain(newChain){
    if(newChain.length <= this.chain.length){
      console.log("Received chain is shorter hence can't be trusted.");
      return;
    }
    else if(!this.isChainValid(newChain)){
      console.log("Received chain is invalid.");
      return;
    }

    this.chain = newChain;
  }
}

module.exports = Blockchain;
