const PST = require('../src/pst');
require('dotenv').config();

const pst = new PST(false);
const owner = 'MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y';
let resolver;

test('Deploy Resolver Base contract', async () => {
  resolver = await pst.deployResolver('author1', owner);
  expect(resolver).toBeDefined();
});

test('Check Owner of the contract', async () => {
  const addr = await pst.readState(resolver, 'getOwner');
  expect(addr.owner).toBe(owner);
});

test('Add a new author', async () => {
  // Invalid.
  await pst.writeState(resolver, 'addAuthor', { author: 'author2', address: owner });
  await pst.writeState(resolver, 'addAuthor', { author: 'aut', address: owner });
  await pst.writeState(resolver, 'addAuthor', { author: 500, address: owner });
  await pst.writeState(resolver, 'addAuthor2', { author: 'author2', address: owner });
  await pst.writeState(resolver, 'addAuthor', { author: 'author2', address: owner });
});

test('Is a valid author', async () => {
  let author = await pst.readState(resolver, 'getAuthor', { author: 'author2' });
  expect(author.address).toBe(owner);
  author = await pst.readState(resolver, 'getAuthor', { author: 'aut' });
  expect(author.address).toBe(false);
});

test('Add a new NFT', async () => {
  await pst.writeState(resolver, 'addNft', { author: 'author1', chainId: 1, address: '0x456736373', ids: 'all' });
  await pst.writeState(resolver, 'addNft', { author: 'author2', chainId: 1, address: '0x456736374', ids: '1-30' });
  await pst.writeState(resolver, 'addNft', { author: 'author3', chainId: 1, address: '0x456736375', ids: 'all' });
});

test('Get One NFT', async () => {
  let author = await pst.readState(resolver, 'getNft', { chainId: 1, address: '0x456736373', tokenId: 5 });
  console.log(author);
  author = await pst.readState(resolver, 'getNft', { chainId: 1, address: '0x456736374', tokenId: 20 });
  console.log(author);
  author = await pst.readState(resolver, 'getNft', { chainId: 1, address: '0x456736374', tokenId: 35 });
  console.log(author);
});

test('Verify the NFT', async () => {
  const state = await pst.contractState(resolver);
  console.log('Authors', state.authors);
  console.log('NFTs', state.nfts);
});
