/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MURF_API_KEY: string;
  readonly VITE_MURF_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
