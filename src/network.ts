import {INetworkConfig} from "./types";

export const network: {
    "mainnet": INetworkConfig,
    "devnet": INetworkConfig,
    "testnet": INetworkConfig
} = {
    "mainnet": {
        bridgeAddress: "https://bridge.walletconnect.org",
        walletAddress: "https://wallet.multiversx.com/dapp/init",
        chainId: "1",
        relayAddress: "wss://relay.walletconnect.com",
        xaliasAddress: "https://xalias.com"
    },
    "devnet": {
        bridgeAddress: "https://bridge.walletconnect.org",
        walletAddress: "https://devnet-wallet.multiversx.com/dapp/init",
        chainId: "D",
        relayAddress: "wss://relay.walletconnect.com",
        xaliasAddress: "https://devnet.xalias.com"
    },
    "testnet": {
        bridgeAddress: "https://bridge.walletconnect.org",
        walletAddress: "https://testnet-wallet.multiversx.com/dapp/init",
        chainId: "T",
        relayAddress: "wss://relay.walletconnect.com",
        xaliasAddress: "https://testnet.xalias.com"
    }
}