import { PemProvider } from '../AuthProviders/PemProvider';
import { IAuthProvider, IAuthProviderFactory } from '../types';
import EventsBus from "../EventBus";

export class PemProviderFactory implements IAuthProviderFactory {
    constructor(private readonly walletPemKey: string) {}
    createProvider(): IAuthProvider {
        return new PemProvider(this.walletPemKey, new EventsBus());
    }
}
