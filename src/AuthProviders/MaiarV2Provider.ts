import {
    AuthProviderType,
    IAuthProvider,
    IAuthState,
    LoginOptions,
    LogoutOptions,
    Transaction
} from "../types";
import {WalletConnectProviderV2} from "maiar-v2/out";
import {ITransaction} from "maiar-v2/out/interface";


export class MaiarV2Provider implements IAuthProvider {
    private provider: WalletConnectProviderV2;
    onChange: (() => void) | undefined;

    constructor(provider: WalletConnectProviderV2) {
        this.provider = provider;
    }

    async init(): Promise<boolean> {
        if (!this.provider.isInitialized()) {
            await this.provider.init();
        }

        return true;
    }

    async login(token?: string, options?: LoginOptions): Promise<string> {
        const topic = options?.pairingTopic;
        const {uri, approval} = await this.provider.connect({topic});
        this.provider.login({token, approval});

        return uri || "";
    }

    logout(options?: LogoutOptions): Promise<boolean> {
        const topic = options?.pairingTopic;
        return this.provider.logout({topic});
    }

    signTransaction(tx: Transaction): Promise<Transaction | null> {
        return this.provider.signTransaction(tx as ITransaction);
    }

    getType(): AuthProviderType {
        return AuthProviderType.MAIARV2;
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