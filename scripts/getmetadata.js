// const chalk = require('chalk');
const permaweb = require('../src/index');

const { log } = console;

const main = (address, tokenId = 1) => {
  if (!address) log('Invalid address');
  console.log(address, tokenId);
  const metadata = permaweb.getMetadata(address, tokenId);
  console.log(metadata);
};

console.log(process.argv);
main(process.argv[2], process.argv[3]);
