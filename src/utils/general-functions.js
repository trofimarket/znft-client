import { notification } from "antd";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import React from "react";
const ethers = require("ethers");
const znftSharesAbi = require("./abi/ZNFT.SHARES.json");

export const provider =
  process.env.REACT_APP_NETWORK === "ETH"
    ? new ethers.providers.InfuraProvider(
        "kovan",
        process.env.REACT_APP_INFURA_KEY
      )
    : new ethers.providers.JsonRpcProvider(
        "https://data-seed-prebsc-1-s1.binance.org:8545/"
      );

export const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_URL,
  cache: new InMemoryCache(),
});

export const sharesBalance = async (address) => {
  const contract = new ethers.Contract(
    process.env.REACT_APP_ZNFT_SHARES,
    znftSharesAbi,
    provider
  );
  const balance = await contract.balanceOf(address);
  return ethers.utils.formatUnits(balance, 18);
};

export const routeTo = (path) => {
  this.props.history.push(path);
};

export const notify = (type, message, description, hash) => {
  console.log(hash);
  notification[type]({
    message: message,
    description: description,
    btn: hash ? Link(hash) : null,
  });
};

export const Link = (hash) => (
  <a
    style={{ color: "var(--primary)", textDecoration: "underline" }}
    target="_blank"
    rel="noreferrer noopener"
    href={`https://testnet.bscscan.com/tx/${hash}`}
  >
    View Transaction
  </a>
);
