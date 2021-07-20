const constants = {
  METAMASK_PROVIDER: "metamask",
  COINBASE_PROVIDER: "coinbase",
  WALLET_CONNECT_PROVIDER: "walletconnect",
  ASSETS: {
    BTC: "BTC",
    ETH: "ETH",
  },
  LOGOS: {
    ETH: {
      url: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
    },
    BTC: {
      url: "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
    },
  },
  AUCTION_TYPES: {
    TIME_BASED: {
      code: "TIME-BASED",
      name: "auction",
    },
    TOP_TIME: {
      code: "TOP-TIME",
      name: "toptime",
    },
    FIXED_PRICE: {
      code: "FIXED-PRICE",
      name: "fixedprice",
    },
  },
};

export default constants;
