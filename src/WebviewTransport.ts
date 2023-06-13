import {WebviewPlatforms, WebViewProviderRequestEnums, WebViewProviderResponseEnums} from "./types";
import {detectPlatform} from "./utils/webview";

export default class WebviewTransport {
    private platform: WebviewPlatforms
    private handlers = new Map<string, (message: any) => void>();
    private targetOrigin = "*";

    constructor() {
        this.targetOrigin = window?.parent?.origin ?? "*";
        this.platform = detectPlatform();
        if (typeof window !== "undefined") {
            (window as any).addEventListener("message", this.handleMessageEvent.bind(this));
            document.addEventListener("message", this.handleMessageEvent.bind(this));
        }
    }

    on(type: WebViewProviderResponseEnums, callback: (message: any) => void) {
        this.handlers.set(type, callback);
    }

    off(type: WebViewProviderResponseEnums) {
        this.handlers.delete(type);
    }

    post(requestType: WebViewProviderRequestEnums, data?: any) {
        postMessage(this.platform, requestType, this.targetOrigin, data);
    }


    handleMessageEvent(event: any) {
        if (
            event.target?.origin !== this.targetOrigin
            && this.platform !== WebviewPlatforms.reactNative
        ) {
            return;
        }

        try {
            const {message, type} = JSON.parse(event.data);
            if (!type) {
                console.error("Message received without type");
            }
            const callback = this.handlers.get(type);
            if (callback) {callback(message);}

        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error("Error parsing response.");
            }
            console.error("Failed to handle event.");
        }
    }

    disconnect() {
        window.removeEventListener("message", this.handleMessageEvent.bind(this));
        document.removeEventListener("message", this.handleMessageEvent.bind(this));
    }

};

const postMessage = (
    platform: WebviewPlatforms,
    type: WebViewProviderRequestEnums,
    targetOrigin: string,
    message?: any
) => {
    switch (platform) {
        case WebviewPlatforms.ios:
            return postIosMessage(type, targetOrigin, message);
        case WebviewPlatforms.reactNative:
            return postReactNativeMessage(type, targetOrigin, message);
        case WebviewPlatforms.web:
            return postWebMessage(type, targetOrigin, message);
        default:
            const unreachable = (): never => {throw "Unreachable assert failed."}
            return unreachable();
    }
};

const postReactNativeMessage = (type: WebViewProviderRequestEnums, targetOrigin: string, message?: any) => {
    (window as any).ReactNativeWebView.postMessage(JSON.stringify({type, message}));
};

const postWebMessage = (type: WebViewProviderRequestEnums, targetOrigin: string, message?: any) => {
    window.postMessage(JSON.stringify({type, message}), targetOrigin);
};

const postIosMessage = (type: WebViewProviderRequestEnums, targetOrigin: string, message?: any) => {
    const methodWords = type.split("_").map((s, i) => {
        let word = s.toLowerCase();
        if (i < 1) {return word;}

        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    methodWords.pop(); // remove "Request" word
    const method = methodWords.join("");
    if (type === WebViewProviderRequestEnums.signTransactionsRequest) {
        (window as any).webkit.messageHandlers[method].postMessage(message, targetOrigin);
    } else {
        (window as any).webkit.messageHandlers[method].postMessage(message);
    }

};
