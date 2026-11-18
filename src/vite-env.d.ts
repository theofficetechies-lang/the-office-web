/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "@paystack/inline-js" {
  export default class Paystack {
    constructor(publicKey: string);
    newTransaction(opts: {
      reference: string;
      email: string;
      amount: number;
      onSuccess?: () => void;
      onCancel?: () => void;
    }): void;
  }
}
