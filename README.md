# permaweb
Set of tools to interact with metadata for NFTs

## Contribute : Install and test
```bash
> git clone https://github.com/alexpuig/permaweb.git
> cd permaweb
> npm install
```

For the testing you need to hace a local test-arweave node running
```bash
> git clone https://github.com/ArweaveTeam/testweave-docker.git
> cd testweave-docker
> docker-compose up
```

Note: always turn down with docker-compose down --remove-orphans

Ready to test
```bash
> npm test
```

The test will try to get metadata from different Contracts and formats, includinf IPFS, arweave, web service... Even with different contracts and ABIs (uri, getTokenURI...).

There are still a lot of patterns and metadata formats to be added, just add an issue if your NFT is not covered by the library.

## Use it as a library
Install
```bash
> npm install --save permaweb
```

Ready to retrieve your first NFT. First add your .env file with the WEB3 API (Alchemy, Infura...).

Let's get a Base64 JON encoded metadata from the LOOT contract.
```javascript
const Permaweb = require('./index');
const permaweb = new Permaweb(process.env.WEB3_ENDPOINT);

const LOOT = '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7';
const loot = await permaweb.getMetadata(LOOT, 1);

const GLITCH = '0x8460bb8eb1251a923a31486af9567e500fc2f43f';
const glitch  = await permaweb.getMetadata(GLITCH, 1);
```


