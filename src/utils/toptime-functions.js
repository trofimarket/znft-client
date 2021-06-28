import { notify } from "./general-functions";
const ethers = require("ethers");
const abi = require("./abi/TOPTIME.json");
const contractAddress = process.env.REACT_APP_TOPTIME;

export const createTopTime = async (tokenId, price, toptime, signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.createAuction(
      tokenId,
      toptime,
      ethers.utils.parseUnits(price, 8)
    );
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
    console.log(e);
    return {
      error: true,
    };
  }
};

export const bidTopTime = async (ticker, amount, auctionId, signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.bidAuctionWithToken(
      auctionId,
      ticker,
      ethers.utils.parseUnits(amount, 8)
    );
    await tx.wait(2);
    notify(
      "success",
      "Bidded On Auction Successfully",
      "You've to wait till end for your bid",
      tx.hash
    );
    return {
      error: false,
      hash: tx.hash,
    };
  } catch (e) {
    notify(
      "error",
      "Error Bidding",
      e.message || "Please try again after some time",
      null
    );
    return {
      error: true,
    };
  }
};

export const claim = async (auctionId, signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.claimAuctionToken(parseInt(auctionId));
    await tx.wait(2);
    notify(
      "success",
      "Token claimed successfully",
      "Your NFT has been claimed and the funds are settled to the seller",
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
