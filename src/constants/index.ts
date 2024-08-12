import { join } from 'path';

export const rootPath = join(__dirname, '..', 'public/images');

export const UI_AVATAR_URL_BASE =
  'https://ui-avatars.com/api/?bold=true&uppercase=true';

  export const { JWT_EXPIRES_IN, JWT_SECRET_KEY } = process.env;
