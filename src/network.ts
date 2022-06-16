import {INetworkConfig} from "./types";

export const network: {
    "mainnet": INetworkConfig,
    "devnet": INetworkConfig,
    "testnet": INetworkConfig
} = {
    "mainnet": {
        bridgeAddress: "https://bridge.walletconnect.org",
        walletAddress: "https://wallet.elrond.com/dapp/init",
    },
    "devnet": {
        bridgeAddress: "https://bridge.walletconnect.org",
        walletAddress: "https://devnet-wallet.elrond.com/dapp/init",
    },
    "testnet": {
        bridgeAddress: "https://bridge.walletconnect.org",
        walletAddress: "https://testnet-wallet.elrond.com/dapp/init",
    }
}