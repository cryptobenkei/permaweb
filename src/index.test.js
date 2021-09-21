const Permaweb = require('./index');
require('dotenv').config();

const LOOT = '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7';
const GLITCH = '0x8460bb8eb1251a923a31486af9567e500fc2f43f';
const ERROR = '011111111111111111111111111111111111111111';

const name = 'NFT #1';
const description = 'NFT description';
const ipfsUrl = 'ipfs://236786732263';
const testApi = 'https://testmutap.com/1111';

const permaweb = new Permaweb(process.env.WEB3_ENDPOINT)
/*
test('Get metadata for JSON Base64', async () => {
  const nft = await permaweb.getMetadata(LOOT, 1)
  expect(nft.title).toBe('Loot');
  expect(nft.symbol).toBe('LOOT');
  expect(nft.metadata.name).toBe('Bag #1');
});

test('Get metadata for Glitch', async () => {
  const nft = await permaweb.getMetadata(GLITCH, 1)
  expect(nft.title).toBe('The Lost Glitches');
  expect(nft.symbol).toBe('GLITCH');
  expect(nft.metadata.name).toBe('Lost Glitch #1');
});

test('Get Invalid metadata', async () => {
  const nft = await permaweb.getMetadata(ERROR, 1)
  expect(nft).toBe(false);
});

test('Create metadata for an NFT', () => {

  // Empty description
  let nft = permaweb.newNFT(name);
  expect(nft.data.metadata.name).toBe(name);
  expect(nft.data.metadata.description).toBeDefined;

  // Full Metadata.
  nft = permaweb.newNFT(name, description);
  nft.setImage(ipfsUrl);
  nft.setMutableUrl(testApi);
  nft.addAttribute('xp', 200);
  nft.addAttribute('color', 'blue');
  nft.setFees(1000);
  expect(nft.data.metadata.version).toBe('permaweb-1');
  expect(nft.data.metadata.name).toBe(name);
  expect(nft.data.metadata.description).toBe(description);
  expect(nft.data.metadata.image).toBe(ipfsUrl);
  expect(nft.data.metadata.seller_fee_basis_points).toBe(1000);
  expect(nft.data.metadata.attributes[0].trait_type).toBe('xp');
  expect(nft.data.metadata.attributes[0].value).toBe(200);
  expect(nft.data.metadata.attributes[1].trait_type).toBe('color');
  expect(nft.data.metadata.attributes[1].value).toBe('blue');
  expect(nft.data.metadata.properties['mutable_url'].uri).toBe(testApi);
  expect(nft.data.metadata.properties['mutable_url'].type).toBe('application/json');
});

test('Upload metadata to arweave', async () => {
  const nft = permaweb.newNFT(name, description);
  const txId = await nft.uploadToArweave();
  console.log(txId);
  expect(await nft.isConfirmed(txId)).toEqual(1);
});
*/

test('Upload an image to arweave', async () => {
  let nft = permaweb.newNFT(name, description);
  let ret = nft.uploadImage('./assets/test.png');
  expect(ret).toBe(false);

  nft = permaweb.newNFT(name, description);
  ret = nft.uploadImage('../assets/image.png');
  expect(ret).toBe(true);
  console.log(nft.data);
  const txId = await nft.uploadToArweave();
  console.log(txId);
  // expect(await metadata.isConfirmed(txId)).toEqual(1);
});
