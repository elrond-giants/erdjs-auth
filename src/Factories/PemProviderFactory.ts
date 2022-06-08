import { PemProvider } from '../AuthProviders/PemProvider';
import { IAuthProvider, IAuthProviderFactory } from '../types';

export class PemProviderFactory implements IAuthProviderFactory {
  walletPemKey: string;
  constructor(walletPemKey: string) {
    this.walletPemKey = walletPemKey;
  }
  createProvider(): IAuthProvider {
    return new PemProvider(this.walletPemKey);
  }
}
