require('dotenv').config();
const ethers = require('ethers');
const axios = require('axios');

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
  }
];

const JSON_BASE64 = 'data:application/json;base64,';

class DecodeMetadata {
  static base64ToJson(data) {
    return Buffer.from(data, 'base64').toString('ascii');
  }

  static async getFromIpfs(uri) {
    const urlPost = `https://ipfs.io/ipfs/${uri}`;
    const metadata = await axios.get(urlPost);
    return metadata.data;
  }
}

/*
 * Metadata
 */
class permaweb {

  /*
   * get Metadata for an NFT.
   *
   * @param {string} address
   * @param {number} tokenId
   * @return {promise} Full metadata for that NFT.
   */
  static getMetadata(address, tokenId) {
    return new Promise(resolve => {
      const { JsonRpcProvider } = ethers.providers;
      const provider = new JsonRpcProvider(process.env.WEB3_ENDPOINT);
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
            metadata: await this.fetchMetadata(result[2]),
          }

          resolve(nft);
        })
        .catch((error) => {
          console.log(error.message);
          resolve(false);
        })
    })
  }

  /**
   * Fetch Metadata
   *
   * @param {string} uri URY in the contract
   * @return {promise} JSON file with metadata.
   */
  static fetchMetadata(uri) {
   console.log(uri);
    for (let i = 0; i < formats.length; i += 1) {
      if (uri.substr(0,formats[i].pattern.length) === formats[i].pattern) {
        const result = DecodeMetadata[formats[i].get](uri.substr(formats[i].pattern.length));
        return result;
      }
    }
  }
}
module.exports = permaweb
