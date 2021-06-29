const { create } = require("ipfs-http-client");

/*
 * Upload Audio to IPFS.
 *
 * @param[in] data: The audio file content.
 * @param[in] path: The path on the IPFS.
 * @param[in] cb: The callback function for later use.
 */
export const uploadAudioIPFS = async (data, path = "night.mp3", cb) => {
  // connect to the default API address http://localhost:5001
  // const node = create('http://host.docker.internal:5001');
  const node = create("http://127.0.0.1:5001");

  let added = await node.add({
    path: path,
    content: data,
  });

  console.log("Added file:", added.path, added.cid.toString());

  cb(added.cid.toString());
};
