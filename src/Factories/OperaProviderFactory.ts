import { OperaProvider as MxOperaProvider } from "@multiversx/sdk-opera-provider";

import { OperaProvider } from "../AuthProviders/OperaProvider";
import EventsBus from "../EventBus";
import { IAuthProvider, IAuthProviderFactory } from "../types";

export class OperaProviderFactory implements IAuthProviderFactory {
  constructor() {}

  createProvider(): IAuthProvider {
    return new OperaProvider(MxOperaProvider.getInstance(), new EventsBus());
  }
}
