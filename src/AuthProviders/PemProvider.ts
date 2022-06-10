import { UserSigner } from '@elrondnetwork/erdjs-walletcore/out';
import { ISignable as PemWalletTransaction } from '@elrondnetwork/erdjs-walletcore/out/interface';

import { AuthProviderType, IAuthProvider, IAuthState, Transaction } from '../types';

export class PemProvider implements IAuthProvider {
  private userSigner: UserSigner;
  private authenticated: boolean = false;
  onChange: (() => void) | undefined;


  constructor(walletPemKey: string) {
    this.userSigner = UserSigner.fromPem(walletPemKey);
  }

  getAddress(): string {
    return this.userSigner.getAddress().bech32();
  }

  async init(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async login(): Promise<string> {
    if (this.onChange) {this.onChange();}

    return Promise.resolve(this.getAddress());
  }

  async logout(): Promise<boolean> {
    this.authenticated = false;
    if (this.onChange) {this.onChange();}

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

  toJson(): IAuthState {
    return {
      address: this.getAddress(),
      authProviderType: this.getType(),
      authenticated: this.authenticated,
    };
  }
}
