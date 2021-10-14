require('dotenv').config();
const chalk = require('chalk');
const figlet = require('figlet');
const Permaweb = require('../src/index');

const wallet = require('../secret/arweave-wallet.json');
// const wallet = false;
const permaweb = new Permaweb(wallet);
const { log } = console;

const upload = async (name, description) => {
  const nft = permaweb.newNFT(name, description);
  nft.uploadImage('../assets/image.png');
  const txId = await nft.uploadToArweave();
  await nft.isConfirmed(txId);
  log('\n');
  log(chalk.green.bold('txId'), txId);
  console.log(nft.data.metadata);
  log('\n');
};

figlet('Permaweb', async (err, data) => {
  console.log(data);
  const name = 'Ticket #2';
  const description = 'Ticket to attend our event';
  upload(name, description);
});
