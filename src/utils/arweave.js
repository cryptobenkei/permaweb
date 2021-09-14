const Arweave = require('arweave');
const fs = require('fs/promises');
const path = require('path');

module.exports = class Arweave {

  async upload(wallet, data, dataType) {
    // Connect Wallet and verify balance.
    const arweave = Arweave.init({ host:'arweave.net', port: 443, protocol: 'https' });
    const address = await arweave.wallets.jwkToAddress(wallet);
    const balance = await arweave.wallets.getBalance(address);
    let ar = arweave.ar.winstonToAr(balance);
    console.log(`Balance ${address} = ${ar} AR`);
	  return;

    // let data = await fs.readFile(path.join(__dirname,'image.jpeg'));
    let transaction = await arweave.createTransaction({ data }, key);
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
    await arweave.transactions.sign(transaction, key);
    let uploader = await arweave.transactions.getUploader(transaction);
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
	return transaction.id;
  }

  async isConfirmed(transactioniId, confirmations) {
    // Connect Wallet and verify balance.
    const arweave = Arweave.init({ host:'arweave.net', port: 443, protocol: 'https' });
    const result = await arweave.transactions.getStatus(transactionId);
	return (result.status === 200 && result.confirmed.number_of_confirmations > confirmations)
  }
}

