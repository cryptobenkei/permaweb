const axios = require('axios');

class DecodeMetadata {
  static base64ToJson(data) {
    const metadata = Buffer.from(data, 'base64').toString('ascii');
    return JSON.parse(metadata);
  }

  static async getFromIpfs(_uri) {
    const uri = (_uri.substr(0, 5) === 'ipfs/' ? _uri.substr(5) : _uri);
    const urlPost = `https://ipfs.io/ipfs/${uri}`;
    const metadata = await axios.get(urlPost);
    return metadata.data;
  }

  static async getFromApi(uri, url) {
	console.log('*** GET', url);
    const metadata = await axios.get(url);
	// console.log(metadata.data)
    return metadata.data;
  }
}

module.exports = DecodeMetadata;
