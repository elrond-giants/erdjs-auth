import { HWProvider } from '@elrondnetwork/erdjs-hw-provider/out';

import { LedgerProvider } from '../AuthProviders/LedgerProvider';
import { IAuthProvider, IAuthProviderFactory } from '../types';

export class LedgerProviderFactory implements IAuthProviderFactory {
  private readonly addressIndex: number;
  constructor(addressIndex: number) {
    this.addressIndex = addressIndex;
  }
  createProvider(): IAuthProvider {
    return new LedgerProvider(new HWProvider(), this.addressIndex);
  }
}
