import { auctionTypes } from "../types";

const auctionActions = {
  startNewBid() {
    return {
      type: auctionTypes.START_NEW_BID,
    };
  },

  cancelNewBid() {
    return {
      type: auctionTypes.CANCEL_NEW_BID,
    };
  },
};

export default auctionActions;
