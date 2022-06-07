import {IAuthProvider, IAuthProviderFactory} from "../types";
import ExtensionProvider from "../AuthProviders/ExtensionProvider";
import {ExtensionProvider as ErdExtProvider} from "@elrondnetwork/erdjs-extension-provider/out";

export default class ExtensionProviderFactory implements IAuthProviderFactory {
    createProvider(): IAuthProvider {
        return new ExtensionProvider(ErdExtProvider.getInstance());
    }
};