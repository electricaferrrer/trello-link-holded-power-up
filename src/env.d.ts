/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRELLO_APP_KEY: string;
  readonly VITE_HOLDED_PROXY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
