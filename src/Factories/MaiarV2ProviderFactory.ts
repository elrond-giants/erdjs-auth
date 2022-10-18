import {WalletConnectProviderV2} from "maiar-v2/out";
import {MaiarV2Provider} from '../AuthProviders';
import {IAuthProvider, IAuthProviderFactory, INetworkConfig, NetworkEnv} from '../types';
import {network} from "../network";

export class MaiarV2ProviderFactory implements IAuthProviderFactory {
    private networkOptions: INetworkConfig;
    private readonly projectId: string;

    constructor(env: NetworkEnv, projectId: string) {
        this.networkOptions = network[env];
        this.projectId = projectId;
    }

    createProvider(): IAuthProvider {
        let maiarProvider: MaiarV2Provider;
        const onChange = () => {
            if (maiarProvider.onChange) {
                maiarProvider.onChange();
            }
        }

        const provider = new WalletConnectProviderV2(
            {
                onClientLogin: onChange,
                onClientLogout: onChange,
                onClientEvent: onChange,
            },
            this.networkOptions.chainId,
            this.networkOptions.relayAddress,
            this.projectId
        );


        maiarProvider = new MaiarV2Provider(provider);

        return maiarProvider;
    }
}
