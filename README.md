# Elrond Auth Providers

### Overview

This library aims to make it easy to authenticate and sign transactions on Elrond network. It offers a common interface
for all auth providers.

### Install

```bash
npm install @elrond-giants/erdjs-auth
```

### Usage

The library comes with simple provider factories for all providers. You can customize them by extending them, or you can
choose not to use them at all.

```typescript
import {WebProviderFactory} from "@elrond-giants/erdjs-auth";


const networkAddress = "https://devnet-wallet.elrond.com/dapp/init";
const provider = new WebProviderFactory(networkAddress).createProvider();
await provider.init();

// you can pass a token to be included in auth signature
const token = "some-token";
await provider.login(token);
````

```typescript
const address = provider.getAddress();
const authSignature = provider.getSignature();
```

If you are using a react-based framework we recommend using the `@elrond-giants/erd-react-hooks` package as it makes the
authentication process even easier.
