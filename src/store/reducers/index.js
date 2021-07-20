import { combineReducers } from "redux";
import walletReducer from "./walletReducer";
import auctionReducer from "./auctionReducer";

export default combineReducers({
  wallet: walletReducer,
  auction: auctionReducer,
});
