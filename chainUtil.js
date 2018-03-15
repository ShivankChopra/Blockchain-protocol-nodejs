const EC = require('elliptic').ec;
const uuidv1 = require('uuid/v1');
const SHA256 = require('crypto-js/sha256');

const ec = new EC('secp256k1');

class ChainUtil{
  static generateKeyPair(){
    return ec.genKeyPair();
  }

  static getUuid(){
    return uuidv1();
  }

  static verifySignature(publicKey, signature, dataHash){
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }

  static hash(data){
    return SHA256(JSON.stringify(data)).toString();
  }
}

module.exports = ChainUtil;
