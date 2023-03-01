import { HWProvider } from '@multiversx/sdk-hw-provider/out';
import { LedgerProvider } from '../AuthProviders';
import { IAuthProvider, IAuthProviderFactory } from '../types';
import EventsBus from "../EventBus";

export class LedgerProviderFactory implements IAuthProviderFactory {
    createProvider(): IAuthProvider {
        return new LedgerProvider(new HWProvider(), new EventsBus());
    }
}
