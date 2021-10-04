// import Permaweb from './index';
const Permaweb = require('../src/index');
require('dotenv').config();

const name = 'NFT #1';
const description = 'NFT description';

const permaweb = new Permaweb(process.env.WEB3_ENDPOINT);
test('Upload metadata to arweave', async () => {
  const nft = permaweb.newNFT(name, description);
  const txId = await nft.uploadToArweave();
  console.log(txId);
  expect(await nft.isConfirmed(txId)).toEqual(1);
});
/*
test('Upload an image to arweave', async () => {
  let nft = permaweb.newNFT(name, description);
  let ret = nft.uploadImage('./assets/test.png');
  expect(ret).toBe(false);

  nft = permaweb.newNFT(name, description);
  ret = nft.uploadImage('../assets/image.png');
  expect(ret).toBe(true);
  const txId = await nft.uploadToArweave();
  expect(await nft.isConfirmed(txId)).toEqual(1);
});
*/
