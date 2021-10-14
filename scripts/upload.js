require('dotenv').config();
const chalk = require('chalk');
const figlet = require('figlet');
const Permaweb = require('../src/index');

const permaweb = new Permaweb(process.env.WEB3_ENDPOINT);
const { log } = console;

const main = async (name, description) => {
  const nft = permaweb.newNFT(name, description);
  nft.uploadImage('../assets/image.png');
  const txId = await nft.uploadToArweave();
  await nft.isConfirmed(txId)
  log('\n');
  log(chalk.green.bold('txId'), txId);
  console.log(nft.data.metadata);
  log('\n');
};

figlet('Permaweb', async (err, data) => {
  const name = 'NFT 1';
  const description = 'the first nft';
  main(name, description);
});
