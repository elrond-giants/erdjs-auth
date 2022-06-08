import { ExtensionProvider as ErdExtProvider } from '@elrondnetwork/erdjs-extension-provider/out';

import { ExtensionProvider } from '../AuthProviders/ExtensionProvider';
import { IAuthProvider, IAuthProviderFactory } from '../types';

export class ExtensionProviderFactory implements IAuthProviderFactory {
  createProvider(): IAuthProvider {
    return new ExtensionProvider(ErdExtProvider.getInstance());
  }
}
