import { notify, provider, sharesBalance } from "./general-functions";
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

export const create = async (
  hash,
  listingFee,
  platformTax,
  ethWallet,
  bscWallet,
  btcWallet,
  signer
) => {
  const contract = new ethers.Contract(process.env.REACT_APP_DAO, abi, signer);
  try {
    const tx = await contract.createMerchant(
      hash,
      ethers.utils.parseEther(listingFee),
      platformTax,
      ethWallet,
      bscWallet,
      btcWallet
    );
    await tx.wait(2);
    notify(
      "success",
      "Now ZNFT share holders can vote.",
      "Only approved merchants are able to sell NFTs in our marketplace.",
      tx.hash
    );
    return true;
  } catch (e) {
    console.log(e);
    notify(
      "error",
      "Error Creating Merchant",
      e.message || "Please try after some time."
    );
    return false;
  }
};

export const update = async (
  id,
  newListingFee,
  newPlatformTax,
  ethWallet,
  bscWallet,
  btcWallet,
  signer
) => {
  const contract = new ethers.Contract(process.env.REACT_APP_DAO, abi, signer);
  try {
    const tx = await contract.updateParams(
      id,
      ethers.utils.parseEther(newListingFee),
      newPlatformTax,
      ethWallet,
      bscWallet,
      btcWallet
    );
    await tx.wait(2);
    notify(
      "success",
      "Updated merchant proposal information",
      "Your proposal will be again opened up for voting",
      tx.hash
    );
    return true;
  } catch (e) {
    console.log(e);
    notify(
      "error",
      "Error Updating Information",
      e.message || "Please try after some time"
    );
    return false;
  }
};

export const vote = async (id, signer, address) => {
  const shareBalance = await sharesBalance(address);
  if (shareBalance > 0) {
    const contract = new ethers.Contract(
      process.env.REACT_APP_DAO,
      abi,
      signer
    );
    try {
      const tx = await contract.vote(String(id));
      await tx.wait(2);
      notify(
        "success",
        "Vote Completed Successfully",
        "Please refresh the page to see your vote",
        tx.hash
      );
      return {
        success: false,
        votes: shareBalance,
      };
    } catch (e) {
      notify(
        "error",
        "Error Casting Vote",
        e.message || "Please try after some time."
      );
      return false;
    }
  } else {
    notify(
      "error",
      "You should own ZNFT Shares to cast your vote.",
      "Buy ZNFT shares on secondary markets now."
    );
    return false;
  }
};

export const merchantStatus = async (address) => {
  try {
    const contract = new ethers.Contract(
      process.env.REACT_APP_DAO,
      abi,
      provider
    );
    const status = await contract.isMerchant(address);
    return {
      error: false,
      status: status,
    };
  } catch (e) {
    return { error: true };
  }
};

export const listingFee = async (address) => {
  try {
    const contract = new ethers.Contract(
      process.env.REACT_APP_DAO,
      abi,
      provider
    );
    const fee = await contract.listingFee(address);
    return {
      error: false,
      fee: ethers.utils.formatEther(fee),
    };
  } catch (e) {
    return { error: true };
  }
};
