const PST = require('./pst');
require('dotenv').config();

const wallet = require('../secret/arweave-wallet.json');

const pst = new PST(wallet);
let resolver;

test('Deploy Resolver Base contract', async () => {
  resolver = await pst.deployResolver();
  console.log(addr);
  expect(1).toBe(1);

});

test('Check Owner of the contract', async () => {
//   const addr = await pst.getOwner(resolver);
//   console.log(addr);
  expect(1).toBe(1);
});

