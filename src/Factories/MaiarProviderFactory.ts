import {IAuthProvider, IAuthProviderFactory} from "../types";
import {WalletConnectProvider} from "@elrondnetwork/erdjs-wallet-connect-provider/out";
import MaiarProvider from "../AuthProviders/MaiarProvider";

interface IConnectionHandler {
    onLogin?: () => void;
    onLogout?: () => void
}

export default class MaiarProviderFactory implements IAuthProviderFactory {
    private readonly _bridgeUrl: string;
    private _connectionHandler: IConnectionHandler;

    constructor(bridgeUrl: string, connectionHandler: IConnectionHandler) {
        this._bridgeUrl = bridgeUrl;
        this._connectionHandler = connectionHandler;
    }

    createProvider(): IAuthProvider {
        const provider = new WalletConnectProvider(this._bridgeUrl, {
            onClientLogin: this._connectionHandler.onLogin ?? (() => {}),
            onClientLogout: this._connectionHandler.onLogout ?? (() => {}),
        });

        return new MaiarProvider(provider);
    }

};