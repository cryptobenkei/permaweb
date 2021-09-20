const Permaweb = require('./index');
require('dotenv').config();

const LOOT = '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7';
const GLITCH = '0x8460bb8eb1251a923a31486af9567e500fc2f43f';
const ERROR = '011111111111111111111111111111111111111111';

const title = 'NFT #1';
const description = 'NFT idescription';
const ipfsUrl = 'ipfs://236786732263';

const permaweb = new Permaweb(process.env.WEB3_ENDPOINT)

test('Get metadata for JSON Base64', (done) => {
  permaweb.getMetadata(LOOT, 1)
    .then((nft) => {
	  expect(nft.name).toBe('Loot');
	  expect(nft.symbol).toBe('LOOT');
	  expect(nft.metadata.name).toBe('Bag #1');
      done();
    });
});
/*
test('Get metadata for Glitch', (done) => {
  Permaweb.getMetadata(GLITCH, 1)
    .then((nft) => {
	  expect(nft.name).toBe('The Lost Glitches');
	  expect(nft.symbol).toBe('GLITCH');
	  expect(nft.metadata.name).toBe('Lost Glitch #1');
      done();
    });
});

test('Get Invalid metadata', (done) => {
  Permaweb.getMetadata(ERROR, 1)
    .then((nft) => {
	  expect(nft).toBe(false);
      done();
    });
});

test('Create metadata for an NFT', () => {

  // Empty description
  let metadata = Permaweb.newMetadata(title);
  expect(metadata.data.title).toBe(title);
  expect(metadata.data.description).toBe('');
  
  // Full Metadata. 
  metadata = Permaweb.newMetadata(title, description);
  metadata.addImage(ipfsUrl);
  metadata.setMutableUrl('http://mintknight.com/23');
  metadata.addAttribute('xp', 200);
  metadata.addAttribute('color', 'blue');
  expect(metadata.data.spec).toBe('permaweb-1');
  expect(metadata.data.title).toBe(title);
  expect(metadata.data.description).toBe(description);
  expect(metadata.data.image).toBe(ipfsUrl);
  expect(metadata.data.attributes[0].trait_type).toBe('xp');
  expect(metadata.data.attributes[0].value).toBe(200);
  expect(metadata.data.attributes[1].trait_type).toBe('color');
  expect(metadata.data.attributes[1].value).toBe('blue');
});

test('Upload metadata to arweave', async () => {
  const metadata = Permaweb.newMetadata(title, description);
  const txId = await metadata.uploadToArweave();
  expect(await metadata.isConfirmed(txId)).toEqual(1);
});
*/


test('Upload an image to arweave', async () => {
  const metadata = Permaweb.newMetadata(title, description);
  metadata.addImage('./assets/test.png');
  // const txId = await metadata.uploadToArweave();
  // expect(await metadata.isConfirmed(txId)).toEqual(1);
});
