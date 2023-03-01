import {WalletConnectV2Provider} from "@multiversx/sdk-wallet-connect-provider";
import {WalletConnectProvider} from '../AuthProviders';
import {IAuthProvider, IAuthProviderFactory, INetworkConfig, NetworkEnv} from '../types';
import {network} from "../network";
import EventsBus from "../EventBus";

export class WalletConnectProviderFactory implements IAuthProviderFactory {
    private networkOptions: INetworkConfig;
    private readonly projectId: string;

    constructor(env: NetworkEnv, projectId: string) {
        this.networkOptions = network[env];
        this.projectId = projectId;
    }

    createProvider(): IAuthProvider {
        let walletConnectProvider: WalletConnectProvider;
        const eventBus = new EventsBus();

        const provider = new WalletConnectV2Provider(
            {
                onClientLogin: () =>  eventBus.emit("login", {}),
                onClientLogout: () =>  eventBus.emit("logout", {}),
                onClientEvent: (event) => eventBus.emit(event.name, event.data),
            },

            this.networkOptions.chainId,
            this.networkOptions.relayAddress,
            this.projectId
        );


        walletConnectProvider = new WalletConnectProvider(provider, eventBus);

        return walletConnectProvider;
    }
}
