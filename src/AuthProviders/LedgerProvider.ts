import { HWProvider } from '@multiversx/sdk-hw-provider';
import { ITransaction as LedgerTransaction } from '@multiversx/sdk-hw-provider/out/interface';

import {
  AuthProviderType, EventHandler,
  EventType,
  IAuthProvider,
  IAuthState,
  IEventBus,
  Transaction
} from '../types';

export class LedgerProvider implements IAuthProvider {
  private provider: HWProvider;
  private authenticated: boolean = false;
  private address: string | null;
  private signature: string | null;
  private addressIndex: number | null;
  private eventBus: IEventBus;

  constructor(provider: HWProvider, eventBus: IEventBus) {
    this.address = null;
    this.signature = null;
    this.addressIndex = null;
    this.provider = provider;
    this.eventBus = eventBus;
  }

  off(event: EventType, handler: EventHandler): void {
    this.eventBus.unsubscribe(event, handler);
  }

  on(event: EventType, handler: EventHandler): void {
    this.eventBus.subscribe(event, handler);
  }


  getAddress(): string | null {
    return this.address;
  }

  async init(): Promise<boolean> {
    if (this.provider.isInitialized()) {
      return true;
    }
    return this.provider.init();
  }

  getAccounts(page?: number | undefined, pageSize?: number | undefined): Promise<string[]> {
    if (!this?.provider?.isInitialized()) {
      throw new Error("Ledger provider is not initialized.");
    }
    return this.provider.getAccounts(page, pageSize);
  }

  setAccount(accountIndex: number) {
    this.addressIndex = accountIndex;
    return this;
  }

  async login(_token?: string): Promise<string> {
    if (!this.addressIndex) {
      throw new Error("Account is not selectd for Ledger Provider.");
    }

    if (_token) {
      const token = Buffer.from(_token, "utf-8");
      const { address, signature } = await this.provider.tokenLogin({
        addressIndex: this.addressIndex,
        token,
      });
      this.address = address;
      this.signature = signature.hex();
    } else {
      this.address = await this.provider.login({ addressIndex: this.addressIndex });
    }

    this.authenticated = true;
    this.eventBus.emit("login", {});

    return this.address;
  }

  async logout(): Promise<boolean> {
    const result = await this.provider.logout();
    if (result) {
      this.authenticated = false;
    }

    this.eventBus.emit("logout", {});

    return result;
  }

  signTransaction(tx: Transaction): Promise<Transaction | null> {
    return this.provider.signTransaction(tx as LedgerTransaction);
  }

  getSignature() {
    return this.signature;
  }

  getType(): AuthProviderType {
    return AuthProviderType.LEDGER;
  }

  getBaseProvider(): HWProvider {
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
