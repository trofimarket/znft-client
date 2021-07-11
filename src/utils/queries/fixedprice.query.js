import { gql } from "@apollo/client";
import { apolloClient } from "../general-functions";

export const fixedPrices = async () => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
            fixedPrices {
                id
                tokenId
                saleId
                price
                creator
                creationHash
                settlementHash
                buyer
                createdAt
                boughtAt
              }
          }`),
    });
    return data.data.fixedPrices;
  } catch (e) {
    console.log(e);
    return [];
  }
};
