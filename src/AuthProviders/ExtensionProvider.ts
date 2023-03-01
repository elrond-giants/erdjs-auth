import {ExtensionProvider as MxExtensionProvider} from '@multiversx/sdk-extension-provider';

import {
  AuthProviderType, EventHandler,
  EventType,
  IAuthProvider,
  IAuthState,
  IEventBus,
  Transaction
} from '../types';
import {ITransaction} from "@multiversx/sdk-extension-provider/out/interface";

export class ExtensionProvider implements IAuthProvider {
  private provider: MxExtensionProvider;
  private authenticated: boolean = false;
  private eventBus: IEventBus;


  constructor(provider: MxExtensionProvider, eventBus: IEventBus) {
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
    return this.provider.account.address.length ? this.provider.account.address : null;
  }

  async init(): Promise<boolean> {
    if (this.provider.isInitialized()) {
      return true;
    }

    return this.provider.init();
  }

  async login(token?: string): Promise<string> {
    const result = await this.provider.login({token});
    if (!result) {return "";}

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
    return AuthProviderType.EXTENSION;
  }

  getBaseProvider(): MxExtensionProvider {
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
