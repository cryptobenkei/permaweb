const ethers = require('ethers');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
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
    // Basic struct.
	this.data = {
	  address: data.address || false,
	  tokenId: data.tokenId || false,
      metadata: {
        name: (data.name) || false,
        version: 'permaweb-1',
      },
      images: []
	};

    // Initial values if any.
    (data.description) && (this.data.metadata.description = data.description);

    // Arweave.
    this.arweave = {
	  wallet,
      gateway: false
    }
  }

  /**
   * Set Fees
   */
  setFees(fees) {
    // TODO: Check valid values.
    this.data.metadata.seller_fee_basis_points = fees;
  }

  /**
   * Adds an image from a file to be uploaded.
   */
  uploadImage(imagePath) {
    const img = path.join(__dirname, imagePath);
    if (fs.existsSync(img)) {
      this.data.image = img;
      return true;
    }
    return false;
  }

  /**
   * Sets the image (URL).
   */
  setImage(image) {
    this.data.metadata.image = image;
  }

  /**
   * adds an Attribute
   */
  addAttribute(attrId, attrValue) {
    if (!this.data.metadata.attributes) this.data.metadata.attributes = [];
	this.data.metadata.attributes.push({
	  trait_type: attrId,
	  value: attrValue,
	});
  }

  /**
   * Sets the Mutable URL
   */
  setMutableUrl(uri) {
    if (!this.data.metadata.properties) this.data.metadata.properties= [];
	this.data.metadata.properties['mutable_url'] = {
	  uri,
	  type: 'application/json',
    }
  }

  /**
   * Upload Metadata to Arweave.
   */
  async uploadToArweave() {
    if (!this.arweave.gateway) {
      this.arweave.gateway = new ArweaveConnect(this.arweave.wallet);
      await this.arweave.gateway.init();
	}
    if (this.data.image) {
      const imageTxId = await this.arweave.gateway.upload(this.data.image, 'png');
      this.data.metadata.image =`ar://${imageTxId}`;
    }

    const txId = await this.arweave.gateway.upload(this.data.metadata, 'json');
    return `ar://${txId}`;
  }

  /**
   * Get confirmations for a transaction
   */
  async isConfirmed(uri) {
    if (!this.arweave.gateway) {
      this.arweave.gateway = new ArweaveConnect(this.arweave.wallet);
      await this.arweave.gateway.init();
	}
	const txId = uri.substr(5);
	return (await this.arweave.gateway.confirmations(txId));
  }

  /**
   * Fetch the Metadata
   */
  async getMetadata(web3Provider) {
    return new Promise(async (resolve, reject) => {
      try {
        const { JsonRpcProvider } = ethers.providers;
        const provider = new JsonRpcProvider(web3Provider);
        const contract = new ethers.Contract(this.data.address, ERC721_ABI, provider);
        const promises = [
          contract.name(),
          contract.symbol(),
          contract.tokenURI(this.data.tokenId),
        ];
        Promise.all(promises)
          .then(async (result) => {
            this.data.title = result[0];
            this.data.symbol = result[1];
            this.data.metadata = await this.fetchMetadata(result[2]);
            if (this.data.metadata.image) {
              this.data.metadata.image = await this.fetchMetadata(this.data.metadata.image);
            }
            resolve(true);
          })
          .catch(() => {
            reject();
          });
      } catch (e) {
        console.log(e);
        reject();
      }
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
