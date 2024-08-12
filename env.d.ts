declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGODB_URI: string
    SALT_OR_ROUNDS: string
    JWT_SECRET_KEY: string
    JWT_EXPIRES_IN: string
    MAIL_USER: string
    MAIL_PASS: string
  }
}
