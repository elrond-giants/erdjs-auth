import { WalletConnectProvider } from '@elrondnetwork/erdjs-wallet-connect-provider/out';
import { ITransaction } from '@elrondnetwork/erdjs-wallet-connect-provider/out/interface';

import { AuthProviderType, IAuthProvider, IAuthState, Transaction } from '../types';

export class MaiarProvider implements IAuthProvider {
  private provider: WalletConnectProvider;

  constructor(provider: WalletConnectProvider) {
    this.provider = provider;
  }

  async init(): Promise<boolean> {
    if (!this.provider.isInitialized()) {
      return this.provider.init();
    }

    return true;
  }

  async login(token?: string): Promise<string> {
    const uri = await this.provider.login();
    if (!token) {
      return uri;
    }

    const loginUrl = new URL(uri);
    loginUrl.searchParams.append("token", token);

    return loginUrl.toString();
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

  toJson(): IAuthState {
    return {
      address: this.provider.address,
      authProviderType: this.getType(),
      authenticated: !!this.provider.address,
    };
  }
}
