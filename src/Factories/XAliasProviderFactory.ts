import {
    IAuthProviderFactory,
    WebProviderOptions,
    XAliasProviderOptions
} from "../types";
import {XAliasProvider} from "../AuthProviders/XAliasProvider";
import {getNetworkOptions} from "../utils/network";
import {WalletProvider} from "@multiversx/sdk-web-wallet-provider/out";
import EventsBus from "../EventBus";

export class XAliasProviderFactory implements IAuthProviderFactory {
    private address: string | null = null;
    protected options: Required<WebProviderOptions>;

    constructor({chainId, walletAddress, networkOptions}: XAliasProviderOptions) {
        if (!walletAddress) {
            const options = getNetworkOptions(chainId);
            walletAddress = options.xaliasAddress;
        }
        this.options = {chainId, walletAddress, networkOptions: networkOptions ?? {}};
    }

    setAddress(value: string | null) {
        this.address = value;

        return this;
    }

    createProvider(): XAliasProvider {
        const provider = new WalletProvider(this.options.walletAddress);

        return new XAliasProvider(
            provider,
            this.options.networkOptions || {},
            new EventsBus(),
            this.address
        );
    }

};