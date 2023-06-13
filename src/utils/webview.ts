import {AuthToken, DecodedLoginTokenType, WebviewPlatforms} from "../types";

const isString = (x: any) => Object.prototype.toString.call(x) === '[object String]';

const decodeBase64 = (s: string) => Buffer.from(s, "base64").toString();

export const detectPlatform = () => {
    const _window = typeof window !== 'undefined' ? (window as any) : {};

    if (_window.ReactNativeWebView) {return WebviewPlatforms.reactNative;}
    if (_window.webkit) {return WebviewPlatforms.ios;}

    return WebviewPlatforms.web;
};

export const decodeAuthToken = (token: string): AuthToken | null => {
    if (!isString(token)) {return null;}

    const parts = token.split('.');
    if (parts.length !== 3) {
        console.error("Invalid native auth token");

        return null;
    }

    const [_address, _body, signature] = parts;
    try {
        const address = Buffer.from(_address, "base64").toString();
        const body = Buffer.from(_body, "base64").toString();
        const loginToken = decodeLoginToken(body);
        if (!loginToken) {
            return {
                address,
                body,
                signature,
                blockHash: '',
                origin: '',
                ttl: 0
            };
        }

        return {
            ...loginToken,
            address,
            body,
            signature,
        };

    } catch (e) {
        return null;
    }
}

const decodeLoginToken = (loginToken: string): DecodedLoginTokenType | null => {
    const parts = loginToken.split('.');
    if (parts.length !== 4) {
        console.error(
            'Invalid loginToken. You may be trying to decode a nativeAuthToken. ' +
            'Try using decodeNativeAuthToken method instead'
        );

        return null;
    }

    try {
        const [origin, blockHash, ttl, extraInfo] = parts;
        const parsedExtraInfo = JSON.parse(decodeBase64(extraInfo));
        const parsedOrigin = decodeBase64(origin);

        return {
            ttl: Number(ttl),
            extraInfo: parsedExtraInfo,
            origin: parsedOrigin,
            blockHash
        };
    } catch (e) {
        console.error(`Error trying to decode ${loginToken}:`, e);

        return null;

    }
};