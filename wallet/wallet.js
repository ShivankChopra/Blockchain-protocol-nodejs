const Transaction = require('./transaction.js');
const ChainUtil = require('../chainUtil.js');

const INITIAL_BALANCE = 500;

class Wallet{
  constructor(){
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.generateKeyPair();
    this.address = this.keyPair.getPublic().encode('hex');
  }

  toString(){
    return `Wallet-
                    Address: ${this.address}
                    Balance: ${this.balance}`;
  }

  issueTransaction(address, amount){
    if(amount > this.balance){
      console.log(`Unable to create transaction. Your balance is less than ${amount}`);
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

      //create and return transactionInput
      return new Transaction(transactionInput, transactionOutputs);
    }
  }

  issueSignature(outputs){
    const dataHash = ChainUtil.hash(outputs);
    const signature = this.keyPair.sign(dataHash);
    return signature;
  }

}

module.exports = Wallet;
