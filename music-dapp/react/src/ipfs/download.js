const { create } = require("ipfs-http-client");
const all = require("it-all");
const uint8Array = require("uint8arrays");

/*
 * Download Audio from IPFS.
 *
 * @param[in] cid: The IPFS hash
 * @param[out] audio: The downloaded audio data.
 */
export const downloadAudioIPFS = async (cid) => {
  // connect to the default API address http://localhost:5001
  // const node = create('http://host.docker.internal:5001');
  const node = create("http://127.0.0.1:5001");

  const dataArr = uint8Array.concat(await all(node.cat(cid)));

  return URL.createObjectURL(
    new Blob([dataArr], { type: "audio/mpeg" } /* (1) */)
  );
};
