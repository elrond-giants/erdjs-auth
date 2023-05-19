import { ITransaction as ExtensionTransaction } from "@multiversx/sdk-extension-provider/out/interface";
import { ITransaction as LedgerTransaction } from "@multiversx/sdk-hw-provider/out/interface";
import { ITransaction as OperaTransaction } from "@multiversx/sdk-opera-provider/out/interface";
import { ITransaction as WalletConnectTransaction } from "@multiversx/sdk-wallet-connect-provider/out/interface";
import { ISignable as PemWalletTransaction } from "@multiversx/sdk-wallet/out/interface";
import { ITransaction as WebWalletTransaction } from "@multiversx/sdk-web-wallet-provider/out/interface";

export enum AuthProviderType {
  WALLET_CONNECT = "wallet_connect",
  WEBWALLET = "webwallet",
  EXTENSION = "extension",
  LEDGER = "ledger",
  PEM = "pem",
  OPERA = "opera",
  NONE = "none",
}

export type Transaction =
  | WebWalletTransaction
  | WalletConnectTransaction
  | ExtensionTransaction
  | LedgerTransaction
  | PemWalletTransaction
  | OperaTransaction;

export interface IAuthState {
  address: string | null;
  authProviderType: AuthProviderType;
  authenticated: boolean;
}

export type LoginOptions = {
  pairingTopic?: string;
};

export type LogoutOptions = {
  pairingTopic?: string;
};
export type EventHandler = (e: { name: EventType; data: any }) => void;

export interface IAuthProvider {
  on(event: EventType, handler: EventHandler): void;

  off(event: EventType, handler: EventHandler): void;

  init(): Promise<boolean>;

  login(token?: string, options?: LoginOptions): Promise<string>;

  logout(options?: LogoutOptions): Promise<boolean>;

  signTransaction(tx: Transaction): Promise<Transaction | null>;

  getType(): AuthProviderType;

  toJson(): IAuthState;

  getAddress(): string | null;

  getSignature(): string | null;

  getBaseProvider(): any;
}

export interface IAuthProviderFactory {
  createProvider(): IAuthProvider;
}

export interface IWebConnectionOptions {
  loginRedirectUrl?: string;
  logoutRedirectUrl?: string;
  transactionRedirectUrl?: string;
}

export interface INetworkConfig {
  walletAddress: string;
  bridgeAddress: string;
  chainId: string;
  relayAddress: string;
}

export type NetworkEnv = "testnet" | "devnet" | "mainnet";

export type EventType = "login" | "logout" | string;

export interface IEventBus {
  subscribe(key: EventType, handler: EventHandler): void;

  unsubscribe(key: EventType, handler: EventHandler): void;

  emit(key: EventType, payload: any): void;
}
