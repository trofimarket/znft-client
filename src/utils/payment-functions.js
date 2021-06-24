import { parseUnits } from "@ethersproject/units";
import { notify, provider } from "./general-functions";

const ethers = require("ethers");
const auctionAddress = process.env.REACT_APP_AUCTION;

const tokens = {
  ETH: {
    ca: "0x24Cc33eBd310f9cBd12fA3C8E72b56fF138CA434",
    abi: require("./abi/tokens/WETH.json"),
    decimals: 18,
  },
  BTC: {
    ca: "0xa4abdae0c0f861c11b353f7929fe6db48535eab3",
    abi: require("./abi/tokens/WBTC.json"),
    decimals: 8,
  },
};

export const approveToken = async (ticker, amount, signer) => {
  const token = tokens[ticker];
  const approveAmount = parseUnits(String(amount), token.decimals);
  try {
    const contract = new ethers.Contract(token.ca, token.abi, signer);
    const tx = await contract.approve(auctionAddress, approveAmount);
    await tx.wait();
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

export const allowanceToken = async (ticker, address) => {
  console.log(address);
  const token = tokens[ticker];
  try {
    const contract = new ethers.Contract(token.ca, token.abi, provider);
    let approval = await contract.allowance(address, auctionAddress);
    approval = ethers.utils.formatUnits(approval, token.decimals);
    return {
      error: false,
      approval: approval,
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
    };
  }
};
