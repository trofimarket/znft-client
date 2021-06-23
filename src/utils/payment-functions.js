import { parseUnits } from "@ethersproject/units";
import { notify } from "./general-functions";

const ethers = require("ethers");
const auctionAddress = process.env.REACT_APP_AUCTION;

const tokens = {
  ETH: {
    ca: "0x24Cc33eBd310f9cBd12fA3C8E72b56fF138CA434",
    abi: require("./abi/tokens/WETH.json"),
    decimals: 18,
  },
};

export const approveToken = async (ticker, amount, signer) => {
  const token = tokens[ticker];
  const approveAmount = parseUnits(amount, token.decimals);
  console.log(approveAmount);
  try {
    const contract = new ethers.Contract(token.ca, token.abi, signer);
    const tx = await contract.approve(auctionAddress, approveAmount);
    await tx.wait(2);
    notify(
      "success",
      `Approved ${amount} of ${ticker}`,
      "Now you can bid on the NFT",
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
