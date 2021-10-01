const PST = require('./pst');
require('dotenv').config();

const wallet = require('../secret/arweave-wallet.json');

const pst = new PST(wallet);

test('Deploy Base Token for the PST', async () => {
  await pst.deployToken();
  expect(1).toBe(1);
});


test('Deploy resolver', async () => {
  expect(1).toBe(1);
});

test('Create a new IdWallet', async () => {
  expect(1).toBe(1);
});

