const ArweaveConnect = require('./utils/arweave');
const fs = require('fs');
const path = require('path');

class PST{
  constructor(wallet) {
    this.arweave = {
      wallet,
      gateway: false,
    };
  }

  async deployPST(uri, url) {
    if (!this.arweave.gateway) {
      this.arweave.gateway = new ArweaveConnect(this.arweave.wallet);
      await this.arweave.gateway.init();
    }
  }

  async deployToken() {
    if (!this.arweave.gateway) {
      this.arweave.gateway = new ArweaveConnect(this.arweave.wallet);
      await this.arweave.gateway.init();
    }
    const contract = fs.readFileSync(path.join(__dirname,'./contracts/token-pst.js'));
    const init = fs.readFileSync(path.join(__dirname, './contracts/token-pst.json'));
    await this.arweave.gateway.deploy(contract, init);
  }
}

module.exports = PST;
