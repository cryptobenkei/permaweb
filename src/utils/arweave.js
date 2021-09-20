const Arweave = require('arweave');
const TestWeave =require('testweave-sdk');
const fs = require('fs/promises');
const path = require('path');

module.exports = class Arweave {

  constructor (wallet, testnet = false) {
    this.wallet = wallet;
    this.testnet = testnet;
  }

  async init() {
    if (this.testnet) {
      this.arweave = Arweave.init({
        host: 'localhost',
        port: 1984,
        protocol: 'http',
        timeout: 20000,
        logging: false,
      });
      this.wallet = await TestWeave.init(arweave);

    } else {
      this.arweave = Arweave.init({
        host:'arweave.net',
        port: 443,
        protocol: 'https'
      });
    }
  }

  async upload(data, dataType) {
    return new Promise(async (resolve) => {
      // Connect Wallet and verify balance.
      const address = await arweave.wallets.jwkToAddress(this.wallet);
      const balance = await arweave.wallets.getBalance(address);
      let ar = arweave.ar.winstonToAr(balance);
      console.log(`Balance ${address} = ${ar} AR`);
	    return;

      // let data = await fs.readFile(path.join(__dirname,'image.jpeg'));
      let transaction = await arweave.createTransaction({ data }, this.wallet);
      transaction.addTag('Content-Type', 'image/jpg');
      switch(dataType) {
        case 'png':
          transaction.addTag('Content-Type', 'image/png');
	  	break;
  	    case 'jpg':
        case 'jpeg':
          transaction.addTag('Content-Type', 'image/jpeg');
  		break;
        case 'json':
          transaction.addTag('Content-Type', 'application/json');
	    break;
      }
      await arweave.transactions.sign(transaction, this.wallet);
      let uploader = await arweave.transactions.getUploader(transaction);
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
      }
      resolve(transaction.id);
    });
  }

  async isConfirmed(transactioniId, confirmations) {
    // Connect Wallet and verify balance.
    const arweave = Arweave.init({ host:'arweave.net', port: 443, protocol: 'https' });
    const result = await arweave.transactions.getStatus(transactionId);
	return (result.status === 200 && result.confirmed.number_of_confirmations > confirmations)
  }
}

