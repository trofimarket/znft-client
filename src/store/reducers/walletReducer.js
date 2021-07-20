import { walletTypes } from "../types";

const _state = {
  address: null,
  signer: null,
  isConnected: false,
  failMessage: null,
};

const walletReducer = (state = _state, action) => {
  let updatedState = action.payload;

  switch (action.type) {
    case walletTypes.CONNECT_WALLET:
    case walletTypes.CONNECT_WALLET_FAIL:
      return { ...state, ...updatedState };
    case walletTypes.DISCONNECT_WALLET:
      return state;
  }
  return state;
};

export default walletReducer;
