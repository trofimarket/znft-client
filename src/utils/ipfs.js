const IPFS = require("ipfs-api");

const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  path: "api/v0/1ur96Dj1HCeew1lcTWFIV2fdLm5",
});

export const get = async (hash) => {
  const data = await ipfs.get(hash);
  const bufferData = await JSON.parse(data[0].content.toString());
  return bufferData;
};

export const getFromLink = async (link) => {
  const data = await fetch(link);
  const json = await data.json();
  return json;
};

export const uploadImage = async (buffer) => {
  try {
    const result = await ipfs.files.add(buffer);
    console.log(result);
    return result[0].hash;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const uploadBuffer = async (buffer) => {
  try {
    const result = await ipfs.files.add(buffer);
    console.log(result);
    return result[0].hash;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default ipfs;
