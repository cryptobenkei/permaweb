const ethers = require('ethers');
const axios = require('axios');
const ArweaveConnect = require('./utils/arweave');

const ERC721_ABI = [
  'function name() view returns (string name)',
  'function symbol() view returns (string symbol)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
];

const formats = [{
  spec: 'ipfs',
  pattern: 'ipfs://',
  get: 'getFromIpfs',
},
{
  spec: 'json_base64',
  pattern: 'data:application/json;base64,',
  get: 'base64ToJson',
}];

const JSON_BASE64 = 'data:application/json;base64,';

class DecodeMetadata {
  static base64ToJson(data) {
    const metadata = Buffer.from(data, 'base64').toString('ascii');
    return JSON.parse(metadata);
  }

  static async getFromIpfs(uri) {
    const urlPost = `https://ipfs.io/ipfs/${uri}`;
    const metadata = await axios.get(urlPost);
    return metadata.data;
  }
}

class Metadata {

  /**
   * Constructor.
   *
   * @param {string} type GET or POST.
   *
   */
  constructor(data, wallet = false) {
	this.info = {
	  address: false,
	  tokenId: false,
      title: false,
      description: false,
      spec: 'permaweb-1',
	};
    if (data.title) {
      this.info.title = data.title;
      this.info.description = data.description;
	} else if (data.address) {
      this.info.address = data.address;
      this.info.tokenId = data.tokenId;
	}
	this.wallet = wallet;
    this.ar = false;
  }

  /**
   * Adds an image from a file.
   */
  addImage(image) {
    this.data.image = image;
  }

  /**
   * Sets the image (from IPFS).
   */
  setImage(image) {
    this.data.image = image;
  }

  /**
   * adds an Attribute
   */
  addAttribute(attrId, attrValue) {
    if (!this.data.attributes) this.data.attributes = [];
	this.data.attributes.push({
	  trait_type: attrId,
	  value: attrValue,
	});
  }

  /**
   * Sets the Mutable URL
   */
  setMutableUrl(url) {
    this.mutable_data = url;
  }

  /**
   * Upload Metadata to Arweave.
   */
  async uploadToArweave() {
    if (!this.ar) {
      this.ar = new ArweaveConnect(wallet, true);
      await this.ar.init();
	}
    const txId = await this.ar.upload(this.data, 'json')
    return txId;
  }

  /**
   * Get confirmations for a transaction
   */
  async isConfirmed(txId) {
    if (!this.ar) {
      this.ar = new ArweaveConnect(wallet, true);
      await this.ar.init();
	}
	return (await this.ar.confirmations(txId));
  }

  /**
   * Fetch the Metadata
   */
  async getMetadata(web3Provider) {
    return new Promise((resolve) => {
      const { JsonRpcProvider } = ethers.providers; 
      const provider = new JsonRpcProvider(web3Provider);
      const contract = new ethers.Contract(address, ERC721_ABI, provider);
      const promises = [
        contract.name(),
        contract.symbol(),
        contract.tokenURI(tokenId),
      ];
      Promise.all(promises)
        .then(async (result) => {
          const nft = {
            name: result[0],
            symbol: result[1],
            tokenId,
            metadata: await this.fetchMetadata(result[2]),
          }
          nft.metadata.image = await this.fetchMetadata(nft.metadata.image);
          resolve(nft);
        })
    });
  } 

  /**
   * Fetch Metadata
   *
   * @param {string} uri URY in the contract
   * @return {promise} JSON file with metadata.
   */
  async fetchMetadata(uri) {
    for (let i = 0; i < formats.length; i += 1) {
      if (uri.substr(0,formats[i].pattern.length) === formats[i].pattern) {
        const result = DecodeMetadata[formats[i].get](uri.substr(formats[i].pattern.length));
        return result;
      }
    }
    return uri;
  }
}

module.exports = Metadata;
