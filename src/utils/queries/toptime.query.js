import { gql } from "@apollo/client";
import { apolloClient } from "../general-functions";

export const toptimes = async () => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        topTimes {
            id
            tokenId
            starts
            listingPrice
            createdAt
            highestBid
            highestBidder
            toptime
            creator
            creationHash
            settlementHash
            isSettled
            createdAt
            settledAt
          }
        }`),
    });
    return data.data.topTimes;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const toptimeInfo = async (auctionId) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
              topTimes(where: {id: "${auctionId}"}) {
                id
                tokenId
                starts
                listingPrice
                createdAt
                highestBid
                highestBidder
                toptime
                creator
                creationHash
                settlementHash
                isSettled
                createdAt
                settledAt
                highestBidAt
              }
            }`),
    });
    return data.data.topTimes;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const bids = async (auctionId) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        tBidInfos(where: {auctionId: "${parseInt(
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
    return data.data.tBidInfos;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const tClaims = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        topTimes(where: {highestBidder: "${address}"}) {
              id
              tokenId
              starts
              listingPrice
              createdAt
              highestBid
              highestBidder
              highestBidAt
              toptime
              creator
              creationHash
              settlementHash
              isSettled
              createdAt
              settledAt
            }
          }`),
    });
    return data.data.topTimes;
  } catch (e) {
    console.log(e);
    return null;
  }
};
