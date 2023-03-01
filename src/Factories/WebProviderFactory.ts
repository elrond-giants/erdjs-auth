import { WalletProvider } from '@multiversx/sdk-web-wallet-provider/out';
import { WebProvider } from '../AuthProviders';
import {IAuthProvider, IAuthProviderFactory, IWebConnectionOptions, NetworkEnv} from '../types';
import {network} from "../network";
import EventsBus from "../EventBus";

export class WebProviderFactory implements IAuthProviderFactory {
    private readonly networkAddress: string;
    private connectionOptions: IWebConnectionOptions = {};
    private address: string | null = null;

    constructor(env: NetworkEnv) {
        const networkOptions = network[env];
        this.networkAddress = networkOptions.walletAddress;
    }

    setConnectionOptions(value: IWebConnectionOptions) {
        this.connectionOptions = value;

        return this;
    }

    setAddress(value: string | null) {
        this.address = value;

        return this;
    }

    createProvider(): IAuthProvider {
        const provider = new WalletProvider(this.networkAddress);

        return new WebProvider(provider, this.connectionOptions, new EventsBus(), this.address);
    }
}
