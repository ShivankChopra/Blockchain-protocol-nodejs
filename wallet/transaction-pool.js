const ChainUtil = require('../chainUtil.js');

class TransactionPool{
  constructor(){
    this.transactions = [];
  }

  addNewTransaction(transaction){
    this.transactions.push(transaction);
  }

  clear(){
    this.transactions = [];
  }

  getValidTransactions(){
    this.transactions.filter(transaction => {
      // verify input and output amounts
      const outputSum = transaction.outputs.toReciever.amount + transaction.outputs.toSelf.amount;
      const inputSum = transaction.input.balance;

      if(outputSum !== inputSum){
        console.log(`Transaction ${transaction.input.id} from ${transaction.input.senderAddress} was invalid.`);
        return;
      }

      // verifySignature
      const signature = transaction.input.signature;
      const dataHash = ChainUtil.hash(transaction.outputs);
      const publicKey = transaction.input.senderAddress;

      if(!ChainUtil.verifySignature(publicKey, signature, dataHash)){
        console.log(`Transaction ${transaction.input.id} from ${transaction.input.senderAddress} was invalid.`);
        return;
      }

      return transaction;
    });

    // finally return filtered transactions
    return this.transactions;
  }
}

module.exports = TransactionPool;
