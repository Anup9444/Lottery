export const Assets = {
  80001: {
    networkName: "polygonmumbai",
    isMainnet: false,
    lotteryPaycontract: "0x78d77E5CdcD1221a6bD598BA09e96F9cE43f0Ea4", // correct
    blockExplorer: "https://mumbai.polygonscan.com/tx/",
    USDTTokenAddress: "0x8bf8210d92Df678f61AaBFd561f0B1F83BA7A3fC",
    decimal: 6,
  },

  //BSC chain
  56: {
    networkName: "BSC",
    isMainnet: true,
    lotteryPaycontract: "0x", // need to deploy
    blockExplorer: "https://bscscan.com/",
    USDTTokenAddress: "0x55d398326f99059fF775485246999027B3197955",
    decimal: 18,
  },
};
