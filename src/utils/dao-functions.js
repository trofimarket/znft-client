import { notify, provider, sharesBalance } from "./general-functions";
import ipfs, { get } from "./ipfs";

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

export const create = async (hash, listingFee, platformTax, signer) => {
  const contract = new ethers.Contract(process.env.REACT_APP_DAO, abi, signer);
  try {
    const tx = await contract.createMerchant(
      hash,
      ethers.utils.parseEther(listingFee),
      platformTax
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

export const list = async (start, end) => {
  const count = await proposals();
  const data = [];
  if (end > count) {
    for (let i = start; i <= count; i++) {
      const info = await individual(i);
      const ipfsData = await get(info.hash);
      const concat = {
        ...info,
        ...ipfsData,
      };
      data.push(concat);
    }
    return data;
  } else {
    for (let i = start; i <= end; i++) {
      const info = await individual(i);
      const ipfsData = await get(info.hash);
      const concat = {
        ...info,
        ...ipfsData,
      };
      data.push(concat);
    }
    return data;
  }
};

export const individual = async (id) => {
  const contract = new ethers.Contract(
    process.env.REACT_APP_DAO,
    abi,
    provider
  );
  const data = await contract.proposal(id);
  return {
    hash: data[0],
    address: data[1],
    totalVotes: ethers.utils.formatUnits(data[2], 18),
    status: data[3],
    id: id,
  };
};

export const proposals = async () => {
  const contract = new ethers.Contract(
    process.env.REACT_APP_DAO,
    abi,
    provider
  );
  const proposals = await contract.totalProposals();
  return proposals.toNumber();
};

export const vote = async (id, signer, address) => {
  if ((await sharesBalance(address)) > 0) {
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
    } catch (e) {
      notify(
        "error",
        "Error Casting Vote",
        e.message || "Please try after some time."
      );
    }
  } else {
    notify(
      "error",
      "You should own ZNFT Shares to cast your vote.",
      "Buy ZNFT shares on secondary markets now."
    );
  }
  return true;
};

export const merchantStatus = async (address) => {
  console.log("Checking Merchant Status");
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
