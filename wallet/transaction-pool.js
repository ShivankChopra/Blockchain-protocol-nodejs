class TransactionPool{
  constructor(){
    this.transactions = [];
  }

  addNewTransaction(transaction){
    this.transactions.push(transaction);
  }
}

module.exports = TransactionPool;
