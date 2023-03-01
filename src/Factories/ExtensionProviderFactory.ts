import { ExtensionProvider as ErdExtProvider } from '@multiversx/sdk-extension-provider/out';
import { ExtensionProvider } from '../AuthProviders';
import { IAuthProvider, IAuthProviderFactory } from '../types';
import EventsBus from "../EventBus";

export class ExtensionProviderFactory implements IAuthProviderFactory {
    constructor() {}

    createProvider(): IAuthProvider {
        return new ExtensionProvider(ErdExtProvider.getInstance(), new EventsBus());
    }
}
