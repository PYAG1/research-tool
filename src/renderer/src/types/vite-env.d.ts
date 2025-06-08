/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_GOOGLE_API_KEY: string;
    // Add other environment variables as needed
    [key: string]: string | boolean | undefined;
  };
}
