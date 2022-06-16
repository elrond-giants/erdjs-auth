import { ExtensionProvider as ErdExtProvider } from '@elrondnetwork/erdjs-extension-provider/out';
import { ExtensionProvider } from '../AuthProviders';
import { IAuthProvider, IAuthProviderFactory } from '../types';

export class ExtensionProviderFactory implements IAuthProviderFactory {
  constructor() {}

  createProvider(): IAuthProvider {
    return new ExtensionProvider(ErdExtProvider.getInstance());
  }
}
