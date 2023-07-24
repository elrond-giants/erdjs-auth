import {
    AuthProviderType, EventHandler, EventType,
    IAuthProvider,
    IAuthState, IEventBus,
    LoginOptions,
    LogoutOptions,
    Transaction
} from "../types";
import {WalletConnectV2Provider} from "@multiversx/sdk-wallet-connect-provider";


export class WalletConnectProvider implements IAuthProvider {
    private provider: WalletConnectV2Provider;
    private eventBus: IEventBus;


    constructor(provider: WalletConnectV2Provider, eventBus: IEventBus ) {
        this.provider = provider;
        this.eventBus = eventBus;
    }

    on(event: EventType, handler: EventHandler): void {
        this.eventBus.subscribe(event, handler);
    }

    off(event: EventType, handler: EventHandler): void {
        this.eventBus.unsubscribe(event, handler);
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

    async logout(options?: LogoutOptions): Promise<boolean> {
        const topic = options?.pairingTopic;
        return await this.provider.logout({topic});
    }

    signTransaction(tx: Transaction): Promise<Transaction | null> {
        return this.provider.signTransaction(tx as Transaction);
    }

    signTransactions(transactions: Transaction[]): Promise<Transaction[]> {
        return this.provider.signTransactions(transactions);
    }

    getType(): AuthProviderType {
        return AuthProviderType.WALLET_CONNECT;
    }

    getAddress(): string | null {
        return this.provider.address;
    }

    getSignature(): string | null {
        return this.provider.signature.length ? this.provider.signature : null;
    }

    getBaseProvider(): WalletConnectV2Provider {
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