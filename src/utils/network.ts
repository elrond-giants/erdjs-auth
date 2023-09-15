import {INetworkConfig} from "../types";
import {network} from "../network";

export const getNetworkOptions = (chainId: string): INetworkConfig => {
    const networkOptions = Object.values(network)
        .find((network) => network.chainId === chainId);
    if (!networkOptions) {
        throw new Error(`Unknown chainId: ${chainId}`);
    }

    return networkOptions;
}