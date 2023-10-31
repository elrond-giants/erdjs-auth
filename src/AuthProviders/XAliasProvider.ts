import {WebProvider} from "./WebProvider";
import {AuthProviderType} from "../types";


export class XAliasProvider extends WebProvider {
    getType(): AuthProviderType {
        return AuthProviderType.XALIAS;
    }
}