import { apolloClient } from "../general-functions";
import { gql } from "@apollo/client";

export const balances = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(`{
        tokens(where:{owner:"${address}"}) {
         id
         hash
         owner
        }
    }`),
    });
    return data.data.tokens;
  } catch (e) {
    console.log(e);
    return [];
  }
};
