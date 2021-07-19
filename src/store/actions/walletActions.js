import Wallet from "../../services/Wallet";
import { walletTypes } from "../types";
import constants from "../../constants";

const walletActions = {
  /**
   * Connects to user's wallet of the given provider
   *
   * @param providerType e.g coinbase, metamask or walletconnect
   * @returns {(function(*): void)|*}
   */
  connectWallet(providerType) {
    const wallet = new Wallet(providerType);

    return (dispatch) => {
      wallet
        .connect()
        .then(async (resp) => {
          const provider = resp;
          const network = await provider.getNetwork();

          if (
            providerType === constants.METAMASK_PROVIDER &&
            network.chainId !== 42
          ) {
            // TODO: Deprecate this check when support multiple test networks is added
            dispatch({
              type: walletTypes.CONNECT_WALLET_FAIL,
              payload: {
                isConnected: false,
                failMessage:
                  "Wrong Network Detected! Please connect with Kovan testnet",
              },
            });
          } else {
            const addresses = await provider.listAccounts();
            const signer = await provider.getSigner();

            dispatch({
              type: walletTypes.CONNECT_WALLET,
              payload: {
                address: addresses[0],
                signer: signer,
                isConnected: true,
                failMessage: null,
              },
            });
          }
        })
        .catch((err) => {
          dispatch({
            type: walletTypes.CONNECT_WALLET_FAIL,
            payload: {
              isConnected: false,
              failMessage: err.message,
            },
          });
        });
    };
  },
};

export default walletActions;
