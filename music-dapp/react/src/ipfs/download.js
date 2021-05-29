const { create, CID } = require('ipfs-http-client');
const all = require('it-all');
const uint8Array = require('uint8arrays');

export const downloadAudioIPFS = async (cid) => {
  // connect to the default API address http://localhost:5001
  const node = create('http://127.0.0.1:5001');

  // const cid = 'QmTs711cqrjHLfRifJ3sVq9uCfYcmBTXQYgQtQGETLqbFy';
  cid = cid || 'QmTs711cqrjHLfRifJ3sVq9uCfYcmBTXQYgQtQGETLqbFy';

  console.log(cid);

  const dataArr = uint8Array.concat(await all(node.cat(cid)));

  document.getElementById('music-play').src = URL.createObjectURL(
    new Blob([dataArr], { type: 'audio/mpeg' } /* (1) */)
  );
};
