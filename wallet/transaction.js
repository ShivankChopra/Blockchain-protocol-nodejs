class Transaction{
  constructor(input, outputs){
    this.input = input;
    this.outputs = outputs;
  }

  static createInput(uuid, senderAddress, balance, signature){
    const time = Date.now();

    const input = {
      id : uuid,
      timeStamp: time,
      senderAddress: senderAddress,
      balance: balance,
      signature: signature
    };

    return input;
  }

  static createSingleOutput(amount, recieverAddress){
    const output = {
      recieverAddress: recieverAddress,
      amount: amount
    };

    return output;
  }

  static createOutputs(senderAddress, recieverAddress, amount, balance){
    const outputToReciever = this.createSingleOutput(amount, recieverAddress);
    const outputToself = this.createSingleOutput(balance-amount, senderAddress);

    const outputs = {
      toReciever: outputToReciever,
      toSelf: outputToself
    };

    return outputs;
  }
}

module.exports = Transaction;
