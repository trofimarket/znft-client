import ipfs from "./ipfs";
const ethers = require("ethers");
const abi = require("./abi/DAO.json");

export const upload = async (data) => {
  try {
    const result = await ipfs.files.add(Buffer.from(data));
    return result[0].hash;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const create = async (hash, signer) => {
  const contract = new ethers.Contract(process.env.REACT_APP_DAO, abi, signer);
  const tx = await contract.createMerchant(hash);
  console.log(tx);
};
