import {IAuthProvider, IAuthProviderFactory} from "../types";
import {WebviewProvider} from "../AuthProviders";
import EventsBus from "../EventBus";

export class WebviewProviderFactory implements IAuthProviderFactory {
    constructor() {}

    createProvider(): IAuthProvider {
        return new WebviewProvider(new EventsBus());
    }
}