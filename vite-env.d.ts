/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEEZER_API_KEY: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}