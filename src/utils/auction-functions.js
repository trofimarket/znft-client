import { DECIMALS } from "./constants";
import { notify, provider } from "./general-functions";
const ethers = require("ethers");
const abi = require("./abi/AUCTION.json");
const contractAddress = process.env.REACT_APP_AUCTION;

export const createAuction = async (tokenId, price, ends, fee, signer) => {
  console.log(tokenId, price, ends, signer);
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.createAuction(
      tokenId,
      ends,
      ethers.utils.parseUnits(price, 8),
      {
        value: ethers.utils.parseEther(fee),
      }
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

export const bidAuction = async (ticker, amount, auctionId, signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.bidAuction(
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

export const claim = async (auctionId, hash, signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.claimAuctionToken(parseInt(auctionId), hash);
    await tx.wait(1);
    notify(
      "success",
      "Transaction Successful",
      "Submission of Hash Successful, Your merchant would review it shortly.",
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

export const settle = async (auctionId, signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.releaseAuctionToken(parseInt(auctionId));
    await tx.wait();
    notify(
      "success",
      "Token released successfully",
      "Your NFT has been released to the buyer. Thanks for using trofi.",
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

export const estimate = async (ticker, amount, type) => {
  const qAmount = ethers.utils.parseUnits(amount, 8);
  if (parseFloat(amount) > 0) {
    try {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const token = DECIMALS.filter(
        (data) => data.ticker === ticker.toUpperCase()
      )[0];
      if (type === 1) {
        let eAmount = await contract.tAmount(ticker, qAmount);
        eAmount = ethers.utils.formatUnits(eAmount, token.decimals);
        console.log(eAmount);
        return {
          error: false,
          amount: eAmount,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: true,
      };
    }
  } else {
    return {
      error: false,
      amount: 0,
    };
  }
};
