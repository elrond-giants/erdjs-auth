import { ITransaction } from "@multiversx/sdk-extension-provider/out/interface";
import { OperaProvider as MxOperaProvider } from "@multiversx/sdk-opera-provider";

import { AuthProviderType, EventHandler, EventType, IAuthProvider, IAuthState, IEventBus, Transaction } from "../types";

export class OperaProvider implements IAuthProvider {
  private provider: MxOperaProvider;
  private authenticated: boolean = false;
  private eventBus: IEventBus;

  constructor(provider: MxOperaProvider, eventBus: IEventBus) {
    this.provider = provider;
    this.eventBus = eventBus;
  }

  on(event: EventType, handler: EventHandler): void {
    this.eventBus.subscribe(event, handler);
  }

  off(event: EventType, handler: EventHandler): void {
    this.eventBus.unsubscribe(event, handler);
  }

  getAddress(): string | null {
    return this.provider?.account?.address ? this.provider.account.address : null;
  }

  async init(): Promise<boolean> {
    if (this.provider.isInitialized()) {
      return true;
    }

    return this.provider.init();
  }

  async login(token?: string): Promise<string> {
    const result = await this.provider.login({ token });
    if (!result) {
      return "";
    }

    this.authenticated = true;
    this.eventBus.emit("login", {});

    return this.provider.account.address;
  }

  async logout(): Promise<boolean> {
    const result = await this.provider.logout();
    if (result) {
      this.authenticated = false;
      this.eventBus.emit("logout", {});
    }

    return result;
  }

  signTransaction(tx: Transaction): Promise<Transaction | null> {
    return this.provider.signTransaction(tx as ITransaction);
  }

  getSignature() {
    if (this.provider.account.signature !== undefined) {
      return this.provider.account.signature;
    }

    return null;
  }

  getType(): AuthProviderType {
    return AuthProviderType.OPERA;
  }

  getBaseProvider(): MxOperaProvider {
    return this.provider;
  }

  toJson(): IAuthState {
    return {
      address: this.getAddress(),
      authProviderType: this.getType(),
      authenticated: this.authenticated,
    };
  }
}
