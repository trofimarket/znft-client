import { notify, provider } from "./general-functions";

const ethers = require("ethers");
const abi = require("./abi/NFT.json");
const contractAddress = process.env.REACT_APP_ZNFT;

export const create = async (hash, signer) => {
  console.log(signer);
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    let supply = await contract.totalSupply();
    supply = ethers.utils.formatUnits(supply, 0);
    supply = parseInt(supply) + 1;
    const tx = await contract.mint(supply, hash);
    await tx.wait(2);
    notify(
      "success",
      `NFT Created Successfully with ID #${supply}`,
      "Now you can add your NFT for sale",
      tx.hash
    );
    return {
      tx: tx.hash,
      error: false,
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
    };
  }
};

export const uri = async (tokenId) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const uri = await contract.tokenURI(tokenId);
    console.log(uri, "URL");
    return {
      uri: uri,
      error: false,
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
    };
  }
};

export const totalSupply = async () => {
  Promise(async (resolve, reject) => {
    try {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      let supply = await contract.totalSupply();
      supply = ethers.utils.formatUnits(supply, 0);
      resolve({
        supply: supply,
        error: false,
      });
    } catch (e) {
      reject({
        error: true,
      });
    }
  });
};

export const approveAuction = async (signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.setApprovalForAll(
      process.env.REACT_APP_AUCTION,
      true
    );
    await tx.wait(2);
    notify(
      "success",
      "Approved auction smart contract for using tokens",
      "Now you can list your tokens for auctions",
      tx.hash
    );
    return {
      error: false,
    };
  } catch (e) {
    return {
      error: true,
      message: e,
    };
  }
};

export const approveToptime = async (signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.setApprovalForAll(
      process.env.REACT_APP_TOPTIME,
      true
    );
    await tx.wait(2);
    notify(
      "success",
      "Approved auction smart contract for using tokens",
      "Now you can list your tokens for auctions",
      tx.hash
    );
    return {
      error: false,
    };
  } catch (e) {
    return {
      error: true,
      message: e,
    };
  }
};

export const checkApprovalAuction = async (address) => {
  console.log(address);
  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const status = await contract.isApprovedForAll(
      address,
      process.env.REACT_APP_AUCTION
    );
    console.log(status);
    return {
      error: false,
      status: status,
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
    };
  }
};

export const checkApprovalTopTime = async (address) => {
  console.log(address);
  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const status = await contract.isApprovedForAll(
      address,
      process.env.REACT_APP_TOPTIME
    );
    console.log(status);
    return {
      error: false,
      status: status,
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
    };
  }
};
