const Transaction = require('./transaction.js');
const ChainUtil = require('../chainUtil.js');

//const INITIAL_BALANCE = 500;

class Wallet{
  constructor(){
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.generateKeyPair();
    this.address = this.keyPair.getPublic().encode('hex'); // address is the public key of wallet
  }

  toString(){
    return `Wallet-
                    Address: ${this.address}
                    Balance: ${this.balance}`;
  }

  issueTransaction(address, amount, transactionPool, blockchain){
    // first calculate balance from the blockchain
    this.balance = this.calculateBalance(blockchain);

    // if balance is less than tx being made
    if(amount > this.balance){
      console.log(`Unable to create transaction. Your balance is less than ${amount}`);
      return null;
    }
    // just checking if it isn't blockchain rewarding wallet
    else if(this.address == 'blockchain-wallet'){
      console.log('Unable to create transaction. This is a blockchain wallet');
      return null;
    }
    else{
      // create transaction outputs
      const transactionOutputs = Transaction.createOutputs(this.address, address, amount, this.balance);

      // create transaction inputs
      const uuid = ChainUtil.getUuid();
      const signature = this.issueSignature(transactionOutputs);
      const transactionInput = Transaction.createInput(uuid, this.address, this.balance, signature);

      //deduct amount from Balance
      this.balance -= amount;

      //create transaction and push in unverified transaction pool
      const transaction = new Transaction(transactionInput, transactionOutputs);
      transactionPool.addNewTransaction(transaction);

      return transaction;
    }
  }

  // issue reward for mining by blockchain wallet
  issueRewardTransaction(minerAddress, rewardAmount){
    if(this.address == 'blockchain-wallet'){
      // create transaction outputs
      const output = Transaction.createSingleOutput(rewardAmount, minerAddress);

      const transactionOutputs = {
        toReciever: {
          address: minerAddress,
          amount: rewardAmount
        }
      }

      // create transaction inputs
      const uuid = ChainUtil.getUuid();
      const signature = this.issueSignature(transactionOutputs);
      const transactionInput = Transaction.createInput(uuid, 'blockchain-wallet', 'NA', signature);

      const rewardTransaction = new Transaction(transactionInput, transactionOutputs);
      return rewardTransaction;
    }
    else{
      console.log('Not a blockchain wallet!');
      return null;
    }
  }

  issueSignature(outputs){
    const dataHash = ChainUtil.hash(outputs);
    const signature = this.keyPair.sign(dataHash);
    return signature;
  }

  calculateBalance(blockchain){
    let balance = 0;
    let foundBlock = false;
    let itr = blockchain.chain.length - 1;

    while(!foundBlock && itr > 0){
      const block = blockchain.chain[itr];
      block.data.forEach(transaction => {
        // add all amounts issued to this wallet
        if(transaction.outputs.toReciever.address == this.address){
          balance += transaction.outputs.toReciever.amount;
        }

        /* check the most recent transaction by this wallet and add it's outputs.
           This is assumed that balance in recent transaction was valid */
        if(transaction.input.address == this.address){
          foundBlock = true;
          balance += transaction.outputs.toSelf.amount;
        }
      });

      itr--;
    }

    return this.balance = balance;
  }

  static getBlockchainWallet(){
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }

}

module.exports = Wallet;
