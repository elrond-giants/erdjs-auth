import { WalletConnectProvider } from '@elrondnetwork/erdjs-wallet-connect-provider/out';

import { MaiarProvider } from '../AuthProviders';
import { IAuthProvider, IAuthProviderFactory } from '../types';

export class MaiarProviderFactory implements IAuthProviderFactory {
  private readonly _bridgeUrl: string;

  constructor(bridgeUrl: string) {
    this._bridgeUrl = bridgeUrl;
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
