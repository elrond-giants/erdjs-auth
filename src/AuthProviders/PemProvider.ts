import { UserSigner } from '@multiversx/sdk-wallet';
import { ISignable as PemWalletTransaction } from '@multiversx/sdk-wallet/out/interface';

import {
  AuthProviderType, EventHandler,
  EventType,
  IAuthProvider,
  IAuthState,
  IEventBus,
  Transaction
} from '../types';

export class PemProvider implements IAuthProvider {
  private userSigner: UserSigner;
  private authenticated: boolean = false;
  private eventBus: IEventBus;


  constructor(walletPemKey: string,  eventBus: IEventBus) {
    this.userSigner = UserSigner.fromPem(walletPemKey);
    this.eventBus = eventBus;
  }

  off(event: EventType, handler: EventHandler): void {
    this.eventBus.unsubscribe(event, handler);
  }

  on(event: EventType, handler: EventHandler): void {
    this.eventBus.subscribe(event, handler);
  }

  getAddress(): string {
    return this.userSigner.getAddress().bech32();
  }

  async init(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async login(): Promise<string> {
    this.eventBus.emit("login", {});

    return Promise.resolve(this.getAddress());
  }

  async logout(): Promise<boolean> {
    this.authenticated = false;
    this.eventBus.emit("logout", {});

    return Promise.resolve(true);
  }

  async signTransaction(tx: Transaction): Promise<Transaction | null> {
    await this.userSigner.sign(tx as PemWalletTransaction);
    return tx;
  }

  getSignature() {
    return null;
  }

  getType(): AuthProviderType {
    return AuthProviderType.PEM;
  }

  getBaseProvider(): any {
    return null;
  }

  toJson(): IAuthState {
    return {
      address: this.getAddress(),
      authProviderType: this.getType(),
      authenticated: this.authenticated,
    };
  }
}
