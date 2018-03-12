const Block = require('./blockchain/Block.js');

 function testBlock(){
 const genesis = Block.createGenesisBlock();
 console.log(genesis.toString());

 let count = 0;
 let lastHash = genesis.hash;

 do{
   let timestamp = Date.now();
   let data = "This is a test block nigga " + count + "!";
   let hash = Block.hash(timestamp, lastHash, data);
   const block1 = new Block(timestamp, lastHash, hash, data);
   console.log(block1.toString());

   lastHash = hash;
   count++;
 }while(count<10);
}

testBlock();
