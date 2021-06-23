import { notify } from "./general-functions";

const ethers = require("ethers");
const abi = require("./abi/AUCTION.json");
const contractAddress = process.env.REACT_APP_AUCTION;

export const list = async (tokenId, price, ends, signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.createAuction(tokenId, ends, price);
    await tx.wait(2);
    notify(
      "success",
      "Auction Created Successfully",
      "Now people can bid on your auction",
      tx.hash
    );
    return {
      error: false,
    };
  } catch (e) {
    return {
      error: true,
    };
  }
};
