const Blockchain = require('./blockchain/main.blockchain.js');

const testBlockChain = () => {
       let bc = new Blockchain();
       let bc2 = new Blockchain();

       let count = 0;

       do{
         let timestamp = Date.now();
         let data = "This is a test block nigga " + count + "!";

         bc.addNewBlock(data);
         bc2.addNewBlock(data);
         count++;
       }while(count<10);

       console.log("Blockchain :")

       for(let i=0; i<bc.chain.length; i++){
         console.log(bc.chain[i].toString());
       }

       console.log("Creating a new chain that is shorter than above");

       bc.replaceChain(new Blockchain().chain);

       // trying to tamper Blockchain
       bc2.chain[7].data = "Muhuhuhahahaha i'm evil";
       bc2.addNewBlock("haha i will make tampered chain to be accepted by making it big!");

       bc.replaceChain(bc2.chain);
}

testBlockChain();
