import {
    ITransaction as WebWalletTransaction
} from "@elrondnetwork/erdjs-web-wallet-provider/out/interface";
import {
    ITransaction as WalletConnectTransaction
} from "@elrondnetwork/erdjs-wallet-connect-provider/out/interface";

import {
    ITransaction as ExtensionTransaction
} from "@elrondnetwork/erdjs-extension-provider/out/interface";


export enum AuthProviderType {
    MAIAR = 'maiar',
    WEBWALLET = 'webwallet',
    EXTENSION = 'extension',
    NONE = 'none'
}

export type Transaction = WebWalletTransaction | WalletConnectTransaction | ExtensionTransaction;

export interface IAuthState {
    address: string | null;
    authProviderType: AuthProviderType;
    authenticated: boolean;
}

export interface IAuthProvider {
    init(): Promise<boolean>;

    login(token?: string): Promise<string>;

    logout(): Promise<boolean>;

    signTransaction(tx: Transaction): Promise<Transaction | null>;

    getType(): AuthProviderType

    toJson(): IAuthState

    getAddress(): string | null;

    getSignature(): string | null;

}

export interface IAuthProviderFactory {
    createProvider(): IAuthProvider;
}

export interface IWebConnectionOptions {
    loginRedirectUrl?: string;
    logoutRedirectUrl?: string;
    transactionRedirectUrl?: string;
}


