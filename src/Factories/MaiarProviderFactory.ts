import { WalletConnectProvider } from '@elrondnetwork/erdjs-wallet-connect-provider/out';
import { MaiarProvider } from '../AuthProviders';
import {IAuthProvider, IAuthProviderFactory, NetworkEnv} from '../types';
import {network} from "../network";

export class MaiarProviderFactory implements IAuthProviderFactory {
  private readonly _bridgeUrl: string;

  constructor(env: NetworkEnv) {
    const networkOptions = network[env];
    this._bridgeUrl = networkOptions.bridgeAddress;
  }

  createProvider(): IAuthProvider {
    let maiarProvider: MaiarProvider;
    const onChange = () => {
      if (maiarProvider.onChange) {
        maiarProvider.onChange();
      }
    }

    const provider = new WalletConnectProvider(this._bridgeUrl, {
      onClientLogin: onChange,
      onClientLogout: onChange
    });


    maiarProvider = new MaiarProvider(provider);

    return maiarProvider;
  }
}
