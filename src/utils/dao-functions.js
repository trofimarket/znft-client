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
  // console.log({signer})
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
      "TroFi shareholders can now vote on your application.",
      "Only approved merchants are able to create listings.",
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

export const cDistribution = async (addresses, percentages, signer) => {
  const contract = new ethers.Contract(process.env.REACT_APP_DAO, abi, signer);
  try {
    console.log(addresses, percentages);
    const tx = await contract.createDistribution(addresses, percentages);
    await tx.wait();
    notify(
      "success",
      "Trofi shareholder can now vote on your proposal",
      "Once approved you'll get your share",
      tx.hash
    );
    return true;
  } catch (e) {
    console.log(e);
    notify(
      "error",
      "Error creating distribution",
      e.message || "Try after some time"
    );
    return false;
  }
};

export const vDistribution = async (distributionId, support, signer) => {
  const contract = new ethers.Contract(process.env.REACT_APP_DAO, abi, signer);
  try {
    const tx = await contract.voteDistribution(distributionId, support);
    await tx.wait();
    notify(
      "success",
      "Your vote casted successfully",
      "After 24H, the distribution will be ready to be distributed",
      tx.hash
    );
    return true;
  } catch (e) {
    console.log(e);
    notify(
      "error",
      "Error creating distribution",
      e.message || "Try after some time"
    );
  }
};

export const eDistribution = async (distributionId, signer) => {
  const contract = new ethers.Contract(process.env.REACT_APP_DAO, abi, signer);
  try {
    const tx = await contract.distribute(distributionId);
    await tx.wait();
    notify(
      "success",
      "Distribution ended successfully",
      "You would've recieved your share of income",
      tx.hash
    );
    return true;
  } catch (e) {
    console.log(e);
    notify(
      "error",
      "Error creating distribution",
      e.message || "Try after some time"
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
    notify("error", "You must own TroFi shares to vote.");
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

export const platformTax = async (address) => {
  try {
    const contract = new ethers.Contract(
      process.env.REACT_APP_DAO,
      abi,
      provider
    );
    const tax = await contract.platformTax(address);
    return {
      error: false,
      tax: tax,
    };
  } catch (e) {
    return { error: true };
  }
};
