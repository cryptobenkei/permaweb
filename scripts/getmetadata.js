require('dotenv').config();
const chalk = require('chalk');
const figlet = require('figlet');
const Permaweb = require('../src/index');

const { log } = console;

const main = async (provider, address, tokenId = 1) => {
  const permaweb = new Permaweb();
  permaweb.setProvider(provider);
  if (!address) log('Invalid address');
  const nft = await permaweb.getMetadata(address, tokenId);
  // const tx = await permaweb.getTransaction('AxDhHHVH2yjtdEetwBA6z-gWHvycnRXlYqIyiekh0Tg');
  figlet('Permaweb', (err, data) => {
    log('\n');
    log(data);
    log(chalk.green.bold(nft.title), nft.symbol);
    log('\n');
    log(chalk.blue.bold('Name'), nft.metadata.name);
    log(chalk.blue.bold('Description'), nft.metadata.description);
  });
};

main(process.argv[2], process.argv[3], process.argv[4]);
