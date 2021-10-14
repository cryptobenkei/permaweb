const Metadata = require('./metadata');

/*
 * Permaweb
 */
class Permaweb {
  /**
   * Constructor.
   */
  constructor(arweaveWallet = false) {
    this.arweaveWallet = arweaveWallet;
  }

  setProvider(provider) {
    this.web3Endpoint = provider;
  }

  /**
   * new Metadata.
   *
   * @param {string} name Name of the NFT.
   * @param {string} description Description of the NFT.
   */
  newNFT(name, description = false) {
    return new Metadata({ name, description }, this.arweaveWallet);
  }

  /*
   * get Metadata for an NFT.
   *
   * @param {string} address
   * @param {number} tokenId
   * @return {promise} Full metadata for that NFT.
   */
  async getMetadata(address, tokenId) {
    return new Promise((resolve) => {
      const metadata = new Metadata({ address, tokenId }, this.arweaveWallet);
      metadata.getMetadata(this.web3Endpoint)
        .then(() => {
          resolve(metadata.data);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  async getTransaction(txId) {
    const metadata = new Metadata({}, this.arweaveWallet);
    const transaction = await metadata.getTransaction(txId);
    console.log(transaction);
    return txId;
  }
}

module.exports = Permaweb;
