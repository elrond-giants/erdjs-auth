import { HWProvider } from '@elrondnetwork/erdjs-hw-provider/out';
import { ITransaction as LedgerTransaction } from '@elrondnetwork/erdjs-hw-provider/out/interface';

import { AuthProviderType, IAuthProvider, IAuthState, Transaction } from '../types';

export class LedgerProvider implements IAuthProvider {
  private provider: HWProvider;
  private authenticated: boolean = false;
  private address: string | null;
  private signature: string | null;
  private addressIndex: number | null;
  onChange: (() => void) | undefined;

  constructor(provider: HWProvider) {
    this.address = null;
    this.signature = null;
    this.addressIndex = null;
    this.provider = provider;
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
    if (this.onChange) {
      this.onChange();
    }

    return this.address;
  }

  async logout(): Promise<boolean> {
    const result = await this.provider.logout();
    if (result) {
      this.authenticated = false;
    }

    if (this.onChange) {
      this.onChange();
    }

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

  toJson(): IAuthState {
    return {
      address: this.getAddress(),
      authProviderType: this.getType(),
      authenticated: this.authenticated,
    };
  }
}
