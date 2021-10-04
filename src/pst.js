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

  async deployResolver() {
    await this.init();
    // const contract = fs.readFileSync(path.join(__dirname,'./contracts/resolver.js'));
    // const init = fs.readFileSync(path.join(__dirname, './contracts/resolver.json'));
    // const contractSrc = fs.readFileSync(path.join(__dirname,'./contracts/token-pst.js'));
    // const initState = fs.readFileSync(path.join(__dirname, './contracts/token-pst.json'));
    // const addr = await this.arweave.gateway.deploy(contract, initState);
    const initState = {
     "owner": "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M",
     "canEvolve": true
    };
    const contractSrc = `export function handle (state, action) {}`;
    const addr = await this.arweave.gateway.deploy(contractSrc.toString(), JSON.stringify(initState));
    return addr;
  }

  async getOwner(contract) {
    await this.init();
    return this.arweave.gateway.getOwner(contract);
  }
}

module.exports = PST;
