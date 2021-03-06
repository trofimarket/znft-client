import { gql } from "@apollo/client";
import { apolloClient } from "../general-functions";

export const proposals = async () => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
            merchants(first: 5) {
                id
                proposalId
                ipfs
                address
                listingFee
                platformFee
                ethWallet
                bscWallet
                btcWallet
            }                   
          }`),
    });
    return data.data.merchants;
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};

export const distributions = async () => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
      distributions {
        id
        earners
        percentages
        Approved
        Settled
        Rejected
        SettlementHash
        voteFor
        voteAgainst
        proposalHash
      } 
    }`),
    });
    return data.data.distributions;
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};

export const distribution = async (id) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
      distributions(where: {id: "${id}"}) {
        id
        earners
        percentages
        Approved
        Settled
        Rejected
        SettlementHash
        voteFor
        voteAgainst
        proposalHash
      } 
    }`),
    });
    return data.data.distributions[0];
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};

export const votes = async (id) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
            proposals(where:{id: "${id}"}) {
              id
              votes
              status
            }
          }`),
    });
    return data.data.proposals[0];
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};

export const distributionVotes = async (id) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        distributionVotes(where: {distributionId: "${parseInt(id)}"}) {
          id
          votes
          voter
          support
          distributionId
        }
    }`),
    });
    return data.data.distributionVotes;
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};

export const merchantStatus = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        merchants(where: {address: "${address}"})
      }`),
    });
    return {
      error: false,
      status: data.data.merchants.length > 0,
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
    };
  }
};

export const merchantWallets = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        merchants(where: {address: "${address}"}){
          ethWallet
          bscWallet
          btcWallet
      }           
      }`),
    });
    return {
      error: false,
      wallets: data.data.merchants[0],
    };
  } catch (e) {
    return {
      error: true,
    };
  }
};
