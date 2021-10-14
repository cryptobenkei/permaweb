const PST = require('../src/pst');
require('dotenv').config();


const main = async () => {
  const pst = new PST(false);
  const owner = 'MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y';

  const resolver = await pst.deployResolver('author1', owner);
  const addr = await pst.readState(resolver, 'getOwner');
  console.log(addr);
  console.log(`PSC Owner = ${addr.owner}`);

  await pst.writeState(resolver, 'addAuthor', { author: 'author2', address: owner });
  await new Promise(resolve => setTimeout(resolve, 25000));
  let author = await pst.readState(resolver, 'getAuthor', { author: 'author2' });
  console.log(`${author.author} - ${author.address}`);

  /*
  await pst.writeState(resolver, 'addAuthor', { author: 500, address: owner });
  await pst.writeState(resolver, 'addAuthor2', { author: 'author2', address: owner });

  expect(author.address).toBe(owner);
  author = await pst.readState(resolver, 'getAuthor', { author: 'aut' });
  expect(author.address).toBe(false);

  await pst.writeState(resolver, 'addNft', { author: 'author2', chainId: 1, address: '0x456736374', ids: '1-30' });
  await pst.writeState(resolver, 'addNft', { author: 'author3', chainId: 1, address: '0x456736375', ids: 'all' });
}

  let author = await pst.readState(resolver, 'getNft', { chainId: 1, address: '0x456736373', tokenId: 5 });
  console.log(author);
  author = await pst.readState(resolver, 'getNft', { chainId: 1, address: '0x456736374', tokenId: 20 });
  console.log(author);
  author = await pst.readState(resolver, 'getNft', { chainId: 1, address: '0x456736374', tokenId: 35 });
  */
  const state = await pst.contractState(resolver);
  console.log('Authors', state.authors);
  console.log('NFTs', state.nfts);
}

main();
