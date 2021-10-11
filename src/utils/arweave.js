const Arweave = require('arweave');
const Smartweave = require('smartweave');
const TestWeave = require('testweave-sdk').default;
const fs = require('fs');

class ArweaveConnect {
  constructor(wallet) {
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
        host: 'arweave.net',
        port: 443,
        protocol: 'https',
      });
    }
  }

  async mine() {
   if (this.testWeave) {
      console.log('mine 1');
      await this.testWeave.mine();
      console.log('mine 2');
      await this.testWeave.mine();
      console.log('mine 3');
      await this.testWeave.mine();
    }
  }
  /* eslint-disable */
  //TODO: FIX Linter problems
  async upload(data, dataType) {
    return new Promise(async (resolve) => { // eslint-disable-line no-eval
      // Connect Wallet and verify balance.
      // const address = await this.arweave.wallets.jwkToAddress(this.wallet);
      // const balance = await this.arweave.wallets.getBalance(address);
      // const ar = this.arweave.ar.winstonToAr(balance);

      try {
        let transaction;
        switch (dataType) {
          case 'png':
            try {
              const bitmap = fs.readFileSync(data);
              const dataPng = Buffer.from(bitmap, 'base64');
              transaction = await this.arweave.createTransaction({ data: dataPng }, this.wallet);
              transaction.addTag('Content-Type', 'image/png');
            } catch (e) { console.log(e); }
            break;
          case 'jpg':
          case 'jpeg':
            // TODO: get image.
            transaction.addTag('Content-Type', 'image/jpeg');
            break;
          case 'json':
            transaction = await this.arweave.createTransaction(
              { data: JSON.stringify(data) }, this.wallet,
            );
            transaction.addTag('Content-Type', 'application/json');
            break;
          default:
            resolve(false);
            break;
        }
        await this.arweave.transactions.sign(transaction, this.wallet);
        const uploader = await this.arweave.transactions.getUploader(transaction);
        while (!uploader.isComplete) {
          await uploader.uploadChunk();
          /*
          console.log(
            `${uploader.pctComplete}% complete,
            ${uploader.uploadedChunks}/${uploader.totalChunks}`
          ); */
        }

        // If in testing mode force arweave mine.
        if (this.testWeave) {
          await this.testWeave.mine();
        }
        resolve(transaction.id);
      } catch (e) {
        resolve(false);
      }
    });
  }
  /* eslint-enable */

  async confirmations(transactionId) {
    // Connect Wallet and verify balance.
    const result = await this.arweave.transactions.getStatus(transactionId);
    await this.mine();
    return (result.status === 200 ? result.confirmed.number_of_confirmations : 0);
  }

  async deploy(contractSrc, initState) {
    const tx = await Smartweave.createContract(
      this.arweave,
      this.wallet,
      contractSrc,
      initState,
    );

    await this.mine();
    return tx;
  }

  async readState(contract, input) {
    const state = await Smartweave.interactRead(
      this.arweave,
      this.wallet,
      contract,
      input,
    );
    return state;
  }

  async writeState(contract, input) {
    return new Promise((resolve) => {
      Smartweave.interactWrite(
        this.arweave,
        this.wallet,
        contract,
        input,
      )
        .then(async (state) => {
          await this.mine();
          console.log(state);
          resolve(state);
        })
        .catch((e) => {
          console.log('Error', e);
          resolve(false);
        });
    });
  }

  async readContractState(contract) {
    return new Promise((resolve) => {
      Smartweave.readContract(
        this.arweave,
        contract,
      )
        .then(async (state) => {
          resolve(state);
        })
        .catch((e) => {
          console.log('Error', e);
          resolve(false);
        });
    });
  }
}

module.exports = ArweaveConnect;
