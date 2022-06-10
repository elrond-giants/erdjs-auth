import { WalletProvider } from '@elrondnetwork/erdjs-web-wallet-provider/out';

import { WebProvider } from '../AuthProviders';
import { IAuthProvider, IAuthProviderFactory, IWebConnectionOptions } from '../types';

export class WebProviderFactory implements IAuthProviderFactory {
  private readonly networkAddress: string;
  private connectionOptions: IWebConnectionOptions = {};
  private address: string | null = null;

  constructor(networkAddress: string) {
    this.networkAddress = networkAddress;
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

    return new WebProvider(provider, this.connectionOptions, this.address);
  }
}
