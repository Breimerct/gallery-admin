declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN: string;
    MONGODB_URI: string;
    SALT_OR_ROUNDS: string;
  }
}
