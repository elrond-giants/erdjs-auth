import { WalletProvider } from '@multiversx/sdk-web-wallet-provider/out';
import { WebProvider } from '../AuthProviders';
import {
    IAuthProvider,
    IAuthProviderFactory,
    WebProviderOptions
} from '../types';
import EventsBus from "../EventBus";
import {getNetworkOptions} from "../utils/network";



export class WebProviderFactory implements IAuthProviderFactory {
    private address: string | null = null;
    protected options: Required<WebProviderOptions>;

    constructor({chainId, walletAddress, networkOptions}: WebProviderOptions) {
        if (!walletAddress) {
            const options = getNetworkOptions(chainId);
            walletAddress = options.walletAddress;
        }
        this.options = {chainId, walletAddress, networkOptions: networkOptions ?? {}};
    }

    setAddress(value: string | null) {
        this.address = value;

        return this;
    }

    createProvider(): IAuthProvider {
        const provider = new WalletProvider(this.options.walletAddress);

        return new WebProvider(
            provider,
            this.options.networkOptions || {},
            new EventsBus(),
            this.address
        );
    }
}
