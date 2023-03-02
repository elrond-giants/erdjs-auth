import {
    AuthProviderType,
    EventHandler,
    EventType,
    IAuthProvider,
    IAuthState,
    IEventBus,
    Transaction,
    WebViewProviderRequestEnums,
    WebViewProviderResponseEnums
} from "../types";
import WebviewTransport from "../WebviewTransport";
import {Transaction as CoreTx} from "@multiversx/sdk-core"
import {decodeAuthToken} from "../utils/webview";

export default class WebviewProvider implements IAuthProvider {
    private token: string | null = null;
    private webviewNetwork = new WebviewTransport();
    private address: string | null = null;
    private signature: string | null = null;

    constructor(private eventBus: IEventBus) { }

    getAddress(): string | null {
        return this.address;
    }

    getBaseProvider(): any {
    }

    getSignature(): string | null {
        return this.signature;
    }

    getType(): AuthProviderType {
        return AuthProviderType.WEBVIEW;
    }

    init(): Promise<boolean> {
        if (window !== undefined) {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("accessToken");
            if (!token) {
                return Promise.resolve(false);
            }
            this.doLogin(token);
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    async login(token?: string): Promise<string> {
        const getAccessToken = () => new Promise<string>((resolve, reject) => {
            this.webviewNetwork.on(
                WebViewProviderResponseEnums.loginResponse,
                (message: any) => {
                    const {accessToken, error} = message;
                    if (error) {
                        reject(error);
                    } else {
                        resolve(accessToken);
                    }
                }
            );
        });
        this.webviewNetwork.post(WebViewProviderRequestEnums.loginRequest);
        try {
            const accessToken = await getAccessToken();

            return this.doLogin(accessToken);
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            this.webviewNetwork.off(WebViewProviderResponseEnums.loginResponse);
        }
    }

    doLogin(accessToken: string): string {
        if (!accessToken) {return "";}
        this.token = accessToken;
        // todo decode token and get address and signature
        const _token = decodeAuthToken(accessToken);
        if (!_token) {return "";}
        const {signature, address} = _token;
        this.address = address;
        this.signature = signature;

        this.eventBus.emit("login", {});

        return address;
    }

    logout(): Promise<boolean> {
        this.webviewNetwork.post(WebViewProviderRequestEnums.logoutRequest);
        this.token = null;
        this.address = null;
        this.signature = null;

        this.eventBus.emit("logout", {});

        return Promise.resolve(true);
    }

    on(event: EventType, handler: EventHandler): void {
        this.eventBus.subscribe(event, handler);
    }

    off(event: EventType, handler: EventHandler): void {
        this.eventBus.unsubscribe(event, handler);
    }

    async signTransaction(tx: Transaction): Promise<Transaction | null> {
        const txs = await this.signTransactions([tx]);

        return txs[0];
    }

    async signTransactions(transactions: Transaction[]): Promise<Transaction[]> {
        const signTxs = () => new Promise<Transaction[]>((resolve, reject) => {
            (window as any).transactionsSigned = (txs: any, error: string) => {
                if (error) {
                    reject(error);
                    (window as any).transactionsSigned = null;
                    return;
                }
                const signedTxs = JSON.parse(txs);
                resolve(signedTxs.map((tx: any) => CoreTx.fromPlainObject(tx)));
                (window as any).transactionsSigned = null;
            };

            this.webviewNetwork.on(
                WebViewProviderResponseEnums.signTransactionsResponse,
                (message: any) => {
                    const {transactions, error} = message;
                    if (error) {
                        reject(error);
                    } else {
                        resolve(transactions.map((tx: any) => CoreTx.fromPlainObject(tx)));
                    }
                }
            );
        });

        try {
            this.webviewNetwork.post(
                WebViewProviderRequestEnums.signTransactionsRequest,
                transactions
            );

            return await signTxs();
        } catch (e) {
            throw e;
        } finally {
            this.webviewNetwork.off(WebViewProviderResponseEnums.signTransactionsResponse);
        }
    }

    toJson(): IAuthState {
        return {
            address: this.address,
            authenticated: !!this.address,
            authProviderType: this.getType(),
        };
    }

};
