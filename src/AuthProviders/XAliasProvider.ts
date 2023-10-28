import { Transaction as CoreTransaction } from "@multiversx/sdk-core/out";
import { WalletProvider } from "@multiversx/sdk-web-wallet-provider";

import {
  AuthProviderType,
  EventHandler,
  EventType,
  IAuthProvider,
  IAuthState,
  IEventBus,
  IWebConnectionOptions,
  Transaction,
} from "../types";

export class XAliasProvider implements IAuthProvider {
  private provider: WalletProvider;
  private connectionOptions: IWebConnectionOptions;
  private address: string | null;
  private authenticated: boolean;
  private signature: string | null;

  constructor(
    provider: WalletProvider,
    options: IWebConnectionOptions,
    eventBus: IEventBus,
    address: string | null = null
  ) {
    this.provider = provider;
    this.connectionOptions = options;
    this.address = address;
    this.authenticated = false;
    this.signature = null;
  }

  off(event: EventType, handler: EventHandler): void {}

  on(event: EventType, handler: EventHandler): void {}

  init(): Promise<boolean> {
    if (window !== undefined) {
      const params = new URLSearchParams(window.location.search);
      const address = params.get("address");
      if (null !== address) {
        this.setState({
          address,
          signature: params.get("signature"),
          authenticated: true,
        });
      }
    }
    return Promise.resolve(true);
  }

  login(token?: string): Promise<string> {
    return this.provider.login({
      token,
      callbackUrl: this.connectionOptions.loginRedirectUrl,
    });
  }

  logout(): Promise<boolean> {
    return this.provider.logout({
      callbackUrl: this.connectionOptions.logoutRedirectUrl,
    });
  }

  async signTransaction(tx: Transaction): Promise<Transaction | null> {
    await this.provider.signTransaction(tx as CoreTransaction, {
      callbackUrl: this.connectionOptions.transactionRedirectUrl,
    });

    return null;
  }

  async signTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    await this.provider.signTransactions(transactions as CoreTransaction[], {
      callbackUrl: this.connectionOptions.transactionRedirectUrl,
    });

    return [];
  }

  getAddress(): string | null {
    return this.address;
  }

  getSignature(): string | null {
    return this.signature;
  }

  getType(): AuthProviderType {
    return AuthProviderType.XALIAS;
  }

  setState({
    address,
    signature,
    authenticated,
  }: {
    address: string | null;
    signature?: string | null;
    authenticated?: boolean;
  }) {
    this.address = address;
    this.signature = signature ?? null;
    this.authenticated = authenticated ?? false;

    return this;
  }

  getBaseProvider(): WalletProvider {
    return this.provider;
  }

  toJson(): IAuthState {
    return {
      address: this.address,
      authProviderType: AuthProviderType.XALIAS,
      authenticated: this.authenticated,
    };
  }
}
