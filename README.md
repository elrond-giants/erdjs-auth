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
import {ExtensionProviderFactory} from "@elrond-giants/erdjs-auth";


const provider = new ExtensionProviderFactory().createProvider();
await provider.init();

// you can pass a token to be included in auth signature
const token = "some-token";
await provider.login(token);
````

```typescript
const address = provider.getAddress();
const authSignature = provider.getSignature();
```

An `onChange` callback can be set and it will be called when login/logout is done.

```typescript
const provider = new MaiarProviderFactory("devnet").createProvider();
provider.onChange = () => {
    const {address, authenticated} = provider.toJson();
    console.log(address, authenticated);
};
const initialized = await provider.init();
```

If you are using a react-based framework we recommend using the `@elrond-giants/erd-react-hooks` package as it makes the
authentication process even easier.
