import { auctionTypes } from "../types";

const _state = {
  isBidStarted: false,
};

const auctionReducer = (state = _state, action) => {
  switch (action.type) {
    case auctionTypes.START_NEW_BID:
      return { ...state, isBidStarted: true };
    case auctionTypes.CANCEL_NEW_BID:
      return { ...state, isBidStarted: false };
  }

  return state;
};

export default auctionReducer;
