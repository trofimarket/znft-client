import { gql } from "@apollo/client";
import { apolloClient } from "../general-functions";

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
    console.log(data);
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
            bidInfos(where: {auctionId: "${parseInt(
              auctionId
            )}"}, orderBy: amount, orderDirection: desc) {
              id
              bidder
              auctionId
              tokenId
              currency
              amount
            }
          }`),
    });
    return data.data.bidInfos;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const claims = async (address) => {
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
