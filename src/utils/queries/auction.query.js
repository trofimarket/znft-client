import { gql } from "@apollo/client";
import { apolloClient } from "../general-functions";
import { get } from "../ipfs";

export const auctions = async () => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
          auctions {
            id
            tokenId
            starts
            listingPrice
            createdAt
            highestBid
            highestBidder
            ends
            creator
            creationHash
            settlementHash
            isSettled
            createdAt
            settledAt
          }
        }`),
    });
    return data.data.auctions;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const auctionInfo = async (auctionId) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
              auctions(where: {id: "${auctionId}"}) {
                id
                tokenId
                starts
                listingPrice
                createdAt
                highestBid
                highestBidder
                ends
                creator
                creationHash
                settlementHash
                isSettled
                createdAt
                settledAt
              }
            }`),
    });
    return data.data.auctions;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const bids = async (auctionId) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        aBidInfos(where: {auctionId: "${parseInt(
          auctionId
        )}"}, orderBy: amount, orderDirection: desc) {
              id
              bidder
              auctionId
              tokenId
              currency
              amount
              paid
            }
          }`),
    });
    return data.data.aBidInfos;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const aClaims = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
            auctions(where: {highestBidder: "${address}"}) {
              id
              tokenId
              starts
              listingPrice
              createdAt
              highestBid
              highestBidder
              highestBidAt
              amountPaid
              ends
              creator
              paymentHash
              creationHash
              settlementHash
              isSettled
              createdAt
              settledAt
            }
          }`),
    });
    return data.data.auctions;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const aSettles = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
            auctions(where: {creator: "${address}"}) {
              id
              tokenId
              starts
              listingPrice
              createdAt
              highestBid
              highestBidder
              highestBidAt
              ends
              creator
              paymentHash
              creationHash
              settlementHash
              isSettled
              createdAt
              settledAt
            }
          }`),
    });
    return data.data.auctions;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const merchant = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
          merchants(where: {address: "${address}"}) {
              ipfs
              address
              listingFee
              platformFee
            }
          }`),
    });
    const result = await get(
      data.data.merchants[data.data.merchants.length - 1].ipfs
    );
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};
