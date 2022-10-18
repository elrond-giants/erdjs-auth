import {AuthProviderType, IAuthProvider, IAuthState, Transaction} from "../types";
import {WalletConnectProviderV2} from "maiar-v2/out";
import {ITransaction} from "maiar-v2/out/interface";



export class MaiarV2Provider implements IAuthProvider {
    private provider: WalletConnectProviderV2;
    private pairings: [] = [];
    onChange: (() => void) | undefined;

    constructor(provider: WalletConnectProviderV2) {
        this.provider = provider;
    }

    async init(): Promise<boolean> {
        if (!this.provider.isInitialized()) {
            return this.provider.init();
        }

        return true;
    }

    async login(token?: string): Promise<string> {
        console.log(this.provider.pairings);
        const uri = await this.provider.login();
        return uri;
    }

    logout(): Promise<boolean> {
        return this.provider.logout();
    }

    signTransaction(tx: Transaction): Promise<Transaction | null> {
        return this.provider.signTransaction(tx as ITransaction);
    }

    getType(): AuthProviderType {
        return AuthProviderType.MAIAR;
    }

    getAddress(): string | null {
        return this.provider.address;
    }

    getSignature(): string | null {
        return this.provider.signature.length ? this.provider.signature : null;
    }

    getBaseProvider(): WalletConnectProviderV2 {
        return this.provider;
    }

    toJson(): IAuthState {
        return {
            address: this.provider.address,
            authProviderType: this.getType(),
            authenticated: !!this.provider.address,
        };
    }
}