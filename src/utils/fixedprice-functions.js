import { ethers } from "ethers";
import { notify } from "./general-functions";
const abi = require("./abi/FIXEDPRICE.json");

export const createFixedPriceSale = async (tokenId, price, signer) => {
  try {
    const contract = new ethers.Contract(
      process.env.REACT_APP_FIXEDPRICE,
      abi,
      signer
    );
    const tx = await contract.createSale(
      tokenId,
      ethers.utils.parseUnits(price, 8)
    );
    await tx.wait();
    notify(
      "success",
      "Fixed Price Sale Created Successfully",
      "Now people can buy your product",
      tx.hash
    );
    return tx.hash;
  } catch (err) {
    console.log(err);
    return {
      error: true,
    };
  }
};

export const buyFixedPriceSale = async (saleId, currency, signer) => {
  try {
    const contract = new ethers.Contract(
      process.env.REACT_APP_FIXEDPRICE,
      abi,
      signer
    );
    const tx = await contract.buySale(saleId, currency);
    await tx.wait();
    notify(
      "success",
      "Fixed Price Bought Successfully",
      "You should've recieved your nfts",
      tx.hash
    );
    return tx.hash;
  } catch (err) {
    console.log(err);
    return {
      error: true,
    };
  }
};
