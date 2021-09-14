const permaweb = require('./index');
const LOOT= '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7';
const GLITCH = '0x8460bb8eb1251a923a31486af9567e500fc2f43f';

test('Get metadata for JSON Base64', (done) => {
  permaweb.getMetadata(LOOT, 1)
    .then((metadata) => {
      console.log(metadata);
      done();
    })
})

test('Get metadata for Glitch', (done) => {
  permaweb.getMetadata(GLITCH, 1)
    .then((metadata) => {
      console.log(metadata);
      done();
    })
})
