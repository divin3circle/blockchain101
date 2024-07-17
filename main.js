const sha256 = require("sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = ""; //Hash of the current block
  }
  //We need a way to calculate the hash of this block using its properties
  calculateHash() {
    return sha256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    //The constructor is responsible for initializing the blockchain
    this.chain = [this.createGenesisBlock()]; //The chain is an array of blocks starting with the genesis block
  }
  //The genesis block needs to be added to the chain manually
  createGenesisBlock() {
    //Since this is the genesis block, it has no previous hash
    let genesisBlock = new Block(
      0,
      "17/07/2024",
      { message: "Genesis Block" },
      "0"
    );
    genesisBlock.hash = genesisBlock.calculateHash(); //Calculate the hash of the genesis block
    return genesisBlock;
  }
  //Getting the latest block on the chain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  //Adding a new block to the chain
  addNewBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash; //The hash of the last block on the chain is the previous hash of the new block
    newBlock.hash = newBlock.calculateHash(); //Calculate the hash of the new block since we've changed the previous hash
    this.chain.push(newBlock); //Add the new block to the chain
  }
  isChainValid() {
    //check whether the hashes of the blocks are valid

    for (let i = 1; i < this.chain.length; i++) {
      let currentBlock = this.chain[i];
      let previousBlock = this.chain[i - 1];
      //check whether the has of the current block holds
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      //check whether the previous hash of the current block is equal to the hash of the previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

//Creating a new instance of the blockchain
let myCoin = new Blockchain();

//Adding some blocks to the chain
myCoin.addNewBlock(
  new Block(1, "18/07/2024", { message: "Second Block", amount: 10 })
);
myCoin.addNewBlock(
  new Block(2, "19/07/2024", { message: "Third Block", amount: 20 })
);

//Checking whether the chain is valid
console.log("1. Is the blockchain valid?", myCoin.isChainValid());

//Let's tamper with the second block and try verifying the chain
myCoin.chain[1].data = { message: "Tampered Second Block", amount: 100 };
console.log("2. Is the blockchain valid?", myCoin.isChainValid());

//Let's be even more creative with the tampering🤔
myCoin.chain[1].data = { message: "Tampered Second Block", amount: 100 };
//We recalculate the hash to try and cover our tracks😈
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();
console.log("3. Is the blockchain valid?", myCoin.isChainValid());

// console.log(JSON.stringify(myCoin, null, 4));
