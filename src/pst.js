const fs = require('fs');
const path = require('path');
const ArweaveConnect = require('./utils/arweave');

class PST {
  constructor(contract = false, wallet = false) {
    this.contract = contract;
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

  async createWallet() {
    await this.init();
    const addr = await this.arweave.gateway.createWallet();
    return addr;
  }

  async deployResolver(author, address) {
    await this.init();
    const contractSrc = fs.readFileSync(path.join(__dirname, './contracts/resolver.js'));
    const initState = {
      owner: address,
      counter: 0,
      canEvolve: true,
      authors: {},
      nfts: {},
    };
    initState.authors[author] = address;
    const addr = await this.arweave.gateway.deploy(
      contractSrc.toString(),
      JSON.stringify(initState),
    );
    this.contract = addr;
    return addr;
  }

  async readState(callFunction, state = {}) {
    await this.init();
    const input = { ...state, function: callFunction };
    try {
      const read = await this.arweave.gateway.readState(this.contract, input);
      return read;
    } catch (e) {
      return 'TX Pending';
    }
  }

  async writeState(callFunction, state = {}) {
    await this.init();
    const input = { ...state, function: callFunction };
    try {
      const write = this.arweave.gateway.writeState(this.contract, input);
      return write;
    } catch (e) {
      console.log(e);
      return 'TX Pending';
    }
  }

  async contractState() {
    await this.init();
    try {
      const read = this.arweave.gateway.readContractState(this.contract);
      return read;
    } catch (e) {
      return 'TX pending';
    }
  }
}

module.exports = PST;
