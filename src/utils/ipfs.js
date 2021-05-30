const IPFS = require("ipfs-api");

const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export const get = async (hash) => {
  const data = await ipfs.get(hash);
  const bufferData = await JSON.parse(data[0].content.toString());
  return bufferData;
};

export default ipfs;
