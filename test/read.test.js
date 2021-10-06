// import Permaweb from './index';
const Permaweb = require('../src/index');
require('dotenv').config();

const LOOT = '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7';
const GLITCH = '0x8460bb8eb1251a923a31486af9567e500fc2f43f';
const DIDIERA = '0x765433c059efee858239a820fe58c44973e7283d';
const THUG = '0xc54648d5fc76b1ecbb4f76a33dec7b37caf14f7d';
const ERROR = '011111111111111111111111111111111111111111';

const permaweb = new Permaweb(process.env.WEB3_ENDPOINT);
// Metadata is hardcoded as a Base64Json inside the contract.
test('Get metadata for JSON Base64', async () => {
  const nft = await permaweb.getMetadata(LOOT, 1);
  expect(nft.title).toBe('Loot');
  expect(nft.symbol).toBe('LOOT');
  expect(nft.metadata.name).toBe('Bag #1');
});

// Metadata is one IPFS link : ipfs://QA...
test('Get metadata for Glitch - IPFS', async () => {
  const nft = await permaweb.getMetadata(GLITCH, 1);
  expect(nft.title).toBe('The Lost Glitches');
  expect(nft.symbol).toBe('GLITCH');
  expect(nft.metadata.name).toBe('Lost Glitch #1');
});

// Metadata is one IPFS link : ipfs://ipfs/QA...
test('Get metadata for EthPunk - Api Call', async () => {
  const nft = await permaweb.getMetadata(DIDIERA, 1);
  expect(nft.title).toBe('DidierRa');
  expect(nft.symbol).toBe('DDR');
  expect(nft.metadata.name).toBe('Skull Helmet 01');
});

// Instead of tokenURI it uses uri.
test('Get metadata for Thug 1 - arweave', async () => {
  const nft = await permaweb.getMetadata(THUG, 2);
  expect(nft.title).toBe('pulltherug.finance');
  expect(nft.symbol).toBe('RUGZ');
  expect(nft.metadata.name).toBe('RUGZ "Crypto Thug" Premium NFTS');
});

// Invalid Metadata
test('Get Invalid metadata', async () => {
  const nft = await permaweb.getMetadata(ERROR, 1);
  expect(nft).toBe(false);
});

