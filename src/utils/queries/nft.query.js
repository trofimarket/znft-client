import { apolloClient } from "../general-functions";
import { gql } from "@apollo/client";

const balanceQuery = `{
    tokens {
     id
     hash
     owner
    }
}`;

export const balances = async (address) => {
  try {
    const data = await apolloClient.query({
      query: gql(balanceQuery),
      variables: {
        where: { owner: address },
      },
    });
    return data.data.tokens;
  } catch (e) {
    console.log(e);
    return [];
  }
};
