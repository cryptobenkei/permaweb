const Arweave = require('arweave');
const TestWeave = require('testweave-sdk').default;
const fs = require('fs/promises');
const path = require('path');

module.exports = class ArweaveConnect
{

  constructor (wallet) {
    this.wallet = wallet;
    this.testnet = (wallet === false);
    this.testWeave = false;
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
      this.testWeave = await TestWeave.init(this.arweave);
	  this.wallet = this.testWeave.rootJWK;
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
      const address = await this.arweave.wallets.jwkToAddress(this.wallet);
      const balance = await this.arweave.wallets.getBalance(address);
      let ar = this.arweave.ar.winstonToAr(balance);

	  try {
        let transaction;
        switch(dataType) {
          case 'png':
            console.log('here:', data)
            try {
            const png = await fs.readFile(data);
            transaction = await this.arweave.createTransaction({ data: png }, this.wallet);
            transaction.addTag('Content-Type', 'image/png');
            } catch (e) {console.log(e);}
            console.log(transaction);
          break;
          case 'jpg':
          case 'jpeg':
            transaction.addTag('Content-Type', 'image/jpeg');
          break;
          case 'json':
            transaction = await this.arweave.createTransaction({ data: JSON.stringify(data) }, this.wallet);
            transaction.addTag('Content-Type', 'application/json');
	      break;
        }
        await this.arweave.transactions.sign(transaction, this.wallet);
        let uploader = await this.arweave.transactions.getUploader(transaction);
        while (!uploader.isComplete) {
          await uploader.uploadChunk();
          // console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        }
		this.testWeave & await this.testWeave.mine();

        resolve(transaction.id);
	  }
      catch (e) {
        resolve(false);
      };

    });
  }

  async confirmations(transactionId) {
    // Connect Wallet and verify balance.
    const result = await this.arweave.transactions.getStatus(transactionId);
    this.testWeave & await this.testWeave.mine();
	return (result.status === 200 ? result.confirmed.number_of_confirmations : 0);
  }
}

