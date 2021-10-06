const ArweaveConnect = require('./utils/arweave');
const fs = require('fs');
const path = require('path');

class PST {
  constructor(wallet) {
    this.arweave = {
      wallet,
      gateway: false,
    };
  }

  async init() {
    if (!this.arweave.gateway) {
      this.arweave.gateway = new ArweaveConnect(this.arweave.wallet);
      await this.arweave.gateway.init();
    }
  }

  async deployResolver(author, address) {
    await this.init();
    const contractSrc = fs.readFileSync(path.join(__dirname, './contracts/resolver.js'));
    const initState = { owner: address, canEvolve: true, authors: {}, nfts: {} };
    initState.authors[author] = address;
    const addr = await this.arweave.gateway.deploy(
      contractSrc.toString(),
      JSON.stringify(initState),
    );
    return addr;
  }

  async readState(contract, callFunction, state = {}) {
    await this.init();
    const input = { ...state, function: callFunction };
    return this.arweave.gateway.readState(contract, input);
  }

  async writeState(contract, callFunction, state = {}) {
    await this.init();
    const input = { ...state, function: callFunction };
    return this.arweave.gateway.writeState(contract, input);
  }

  async contractState(contract) {
    await this.init();
	  console.log(contract);
    return this.arweave.gateway.readContractState(contract);
  }
}

module.exports = PST;
