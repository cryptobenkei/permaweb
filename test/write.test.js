// import Permaweb from './index';
const Permaweb = require('../src/index');
require('dotenv').config();

const name = 'NFT #1';
const description = 'NFT description';
const ipfsUrl = 'ipfs://236786732263';
const testApi = 'https://testmutap.com/1111';

const permaweb = new Permaweb(process.env.WEB3_ENDPOINT);
test('Create metadata for an NFT', () => {
  // Empty description
  let nft = permaweb.newNFT(name);
  expect(nft.data.metadata.name).toBe(name);
  expect(nft.data.metadata.description).toBeDefined();

  // Full Metadata.
  nft = permaweb.newNFT(name, description);
  nft.setImage(ipfsUrl);
  nft.setMutableUrl(testApi);
  nft.addAttribute('xp', 200);
  nft.addAttribute('color', 'blue');
  nft.setFees(1000);
  const { metadata } = nft.data;
  expect(metadata.version).toBe('permaweb-1');
  expect(metadata.name).toBe(name);
  expect(metadata.description).toBe(description);
  expect(metadata.image).toBe(ipfsUrl);
  expect(metadata.seller_fee_basis_points).toBe(1000);
  expect(metadata.attributes[0].trait_type).toBe('xp');
  expect(metadata.attributes[0].value).toBe(200);
  expect(metadata.attributes[1].trait_type).toBe('color');
  expect(metadata.attributes[1].value).toBe('blue');
  expect(metadata.properties.mutable_url.uri).toBe(testApi);
  expect(metadata.properties.mutable_url.type).toBe('application/json');
});
