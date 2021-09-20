const Metadata = require('./metadata');

/*
 * Permaweb
 */
class Permaweb {

  /**
   * Constructor.
   */
  constructor(web3Endpoint, arweaveWallet = false) {
    this.web3Endpoint = web3Endpoint;
    this.arweaveWallet = arweaveWallet;
  }

  /**
   * new Metadata.
   *
   * @param {string} title Title of the NFT.
   * @param {string} description Description of the NFT.
   */
  newMetadata(title, description) {
    return new Metadata({title, description}, this.arweaveWallet);
  }

  /*
   * get Metadata for an NFT.
   *
   * @param {string} address
   * @param {number} tokenId
   * @return {promise} Full metadata for that NFT.
   */
  async getMetadata(address, tokenId) {
	const metadata = new Metadata({address, tokenId}, this.arweaveWallet);
	  console.log('GET 1');
	await metadata.getMetadata(this.web3Endpoint);
	console.log('GET 2');
    return metadata;
  }
}

module.exports = Permaweb;
