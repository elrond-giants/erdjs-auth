import { ExtensionProvider as ErdExtensionProvider } from '@elrondnetwork/erdjs-extension-provider/out';
import { ITransaction } from '@elrondnetwork/erdjs-extension-provider/out/interface';

import { AuthProviderType, IAuthProvider, IAuthState, Transaction } from '../types';

export class ExtensionProvider implements IAuthProvider {
  private provider: ErdExtensionProvider;
  private authenticated: boolean = false;

  constructor(provider: ErdExtensionProvider) {
    this.provider = provider;
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
    await this.provider.login({ token });
    this.authenticated = true;

    return this.provider.account.address;
  }

  async logout(): Promise<boolean> {
    const result = await this.provider.logout();
    if (result) {
      this.authenticated = false;
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

  toJson(): IAuthState {
    return {
      address: this.getAddress(),
      authProviderType: this.getType(),
      authenticated: this.authenticated,
    };
  }
}
