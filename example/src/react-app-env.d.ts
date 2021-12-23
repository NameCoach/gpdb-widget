/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string,
    REACT_APP_GPDB_ACCESS_KEY_ID: string,
    REACT_APP_GPDB_SECRET_ACCESS_KEY: string
  }
}
