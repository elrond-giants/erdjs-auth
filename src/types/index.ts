import {Transaction as CoreTransaction} from "@multiversx/sdk-core/out";


export enum AuthProviderType {
  WALLET_CONNECT = "wallet_connect",
  WEBWALLET = "webwallet",
  EXTENSION = "extension",
  LEDGER = "ledger",
  PEM = "pem",
  WEBVIEW = "webview",
  NONE = "none",
}

export type Transaction = CoreTransaction;

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
}
export type EventHandler = (e: { name: EventType, data: any }) => void;

export interface IAuthProvider {

  on(event: EventType, handler: EventHandler): void;

  off(event: EventType, handler: EventHandler): void;

  init(): Promise<boolean>;

  login(token?: string, options?: LoginOptions): Promise<string>;

  logout(options?: LogoutOptions): Promise<boolean>;

  signTransaction(tx: Transaction): Promise<Transaction | null>;

  signTransactions(transactions: Transaction[]): Promise<Transaction[]>;


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

export enum WebviewPlatforms {
  ios = 'ios',
  reactNative = 'reactNative',
  web = 'web'
}

export enum WebViewProviderRequestEnums {
  signTransactionsRequest = 'SIGN_TRANSACTIONS_REQUEST',
  signMessageRequest = 'SIGN_MESSAGE_REQUEST',
  loginRequest = 'LOGIN_REQUEST',
  logoutRequest = 'LOGOUT_REQUEST',
  reloginRequest = 'RELOGIN_REQUEST'
}

export enum WebViewProviderResponseEnums {
  signTransactionsResponse = 'SIGN_TRANSACTIONS_RESPONSE',
  signMessageResponse = 'SIGN_MESSAGE_RESPONSE',
  loginResponse = 'LOGIN_RESPONSE',
  reloginResponse = 'RELOGIN_RESPONSE'
}

export type DecodedLoginTokenType = {
  blockHash: string;
  extraInfo?: { timestamp?: number };
  origin: string;
  ttl: number;
}

export type AuthToken = {
  address: string;
  body: string;
  signature: string;
} & DecodedLoginTokenType;