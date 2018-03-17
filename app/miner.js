const Wallet = require('../wallet/wallet.js');
const Block = require('../blockchain/Block.js');

const REWARD_AMOUNT = 50;

class Miner{
  constructor(blockchain, transactionPool, wallet, p2pServer){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine(){
    let validTransactions = this.transactionPool.getValidTransactions();

    // create reward transaction
    const blockchainWallet = Wallet.getBlockchainWallet();
    const rewardTransaction = blockchainWallet.issueRewardTransaction(this.wallet.address, REWARD_AMOUNT);
    validTransactions.push(rewardTransaction);

    const minedBlock = this.blockchain.addNewBlock(validTransactions);
    this.p2pServer.syncronizeChain();

    //clear transaction pool and broadcast 'clear' message to peers
    this.transactionPool.clear();
    this.p2pServer.broadcastClear();

    return minedBlock;
  }
}

module.exports = Miner;
