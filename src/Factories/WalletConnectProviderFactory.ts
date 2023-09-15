import {WalletConnectV2Provider} from "@multiversx/sdk-wallet-connect-provider";
import {WalletConnectProvider} from '../AuthProviders';
import {
    IAuthProvider,
    IAuthProviderFactory,
    WalletConnectProviderOptions
} from '../types';
import EventsBus from "../EventBus";
import {getNetworkOptions} from "../utils/network";


export class WalletConnectProviderFactory implements IAuthProviderFactory {
    protected options: Required<WalletConnectProviderOptions>;

    constructor({chainId, projectId, relayAddress}: WalletConnectProviderOptions) {
        if (!relayAddress) {
            const networkOptions = getNetworkOptions(chainId);
            relayAddress = networkOptions.relayAddress
        }
        this.options = {chainId, projectId, relayAddress};
    }

    createProvider(): IAuthProvider {
        const eventBus = new EventsBus();

        const provider = new WalletConnectV2Provider(
            {
                onClientLogin: () =>  eventBus.emit("login", {}),
                onClientLogout: () =>  eventBus.emit("logout", {}),
                onClientEvent: (event) => eventBus.emit(event.name, event.data),
            },

            this.options.chainId,
            this.options.relayAddress,
            this.options.projectId
        );

        return new WalletConnectProvider(provider, eventBus);

    }
}
