var prompt = require('prompt-sync')();
const chalk = require('chalk');
const figlet = require('figlet');
const Permaweb = require('../src/index');
const log = console.log

const error = (msg) => {
    log(chalk.red(`error`) + chalk.grey(` - ${msg}`));
    process.exit(1);
}

const addMetadata = () => {
  const permaweb = new Permaweb(process.env.WEB3_ENDPOINT);
  log(chalk.blue('Type of metadata' + chalk.grey(' (onchain, json)')));
  const type = prompt('Type : ');
  if (!['onchain', 'json'].includes(type)) error('Invalid type');
  const name = prompt('Name : ');
  const description = prompt('Description : ');
  const image = prompt('SVG : ')
  const nft = permaweb.newNFT(name, description);
  nft.encodeSVG(image);
  console.log(nft.data);
  const metadata = nft.encodeMetadata();
  console.log(metadata);
}

const runMain = async (action) => {
  try {
    switch (action) {
      case 'add':
        addMetadata();
        break;
      case 'read':
        break;
    }
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

figlet('Permaweb', (err, data) => {
  const action = process.argv[2];
  if (!['add', 'read'].includes(action)) {
    log(chalk.red(`error - invalid action ${action}`));
    log(chalk.grey('- permaweb add'));
    log(chalk.grey('- permaweb read'));
    process.exit(1);
  }
  figlet('Permaweb', (err, data) => {
    log(`\n${data}`);
    runMain(action);
  })
});
