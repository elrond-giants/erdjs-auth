import { HWProvider } from '@elrondnetwork/erdjs-hw-provider/out';

import { LedgerProvider } from '../AuthProviders';
import { IAuthProvider, IAuthProviderFactory } from '../types';

export class LedgerProviderFactory implements IAuthProviderFactory {
  createProvider(): IAuthProvider {
    return new LedgerProvider(new HWProvider());
  }
}
