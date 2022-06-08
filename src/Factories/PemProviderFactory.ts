import { PemProvider } from '../AuthProviders/PemProvider';
import { IAuthProvider, IAuthProviderFactory } from '../types';

export class PemProviderFactory implements IAuthProviderFactory {
  private readonly walletPemKey: string;
  constructor(walletPemKey: string) {
    this.walletPemKey = walletPemKey;
  }
  createProvider(): IAuthProvider {
    return new PemProvider(this.walletPemKey);
  }
}
