export const EXPIRATION_OPTIONS = {
  '1h': {
    expiresIn: '1h',
    expirationDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
  },
  '1d': {
    expiresIn: '1d',
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  '1w': {
    expiresIn: '1w',
    expirationDate: new Date(Date.now() + 1 * 7 * 24 * 60 * 60 * 1000),
  },
  '1m': {
    expiresIn: '1m',
    expirationDate: new Date(Date.now() + 1 * 30 * 24 * 60 * 60 * 1000),
  },
  '1y': {
    expiresIn: '1y',
    expirationDate: new Date(Date.now() + 1 * 365 * 24 * 60 * 60 * 1000),
  },
  '2h': {
    expiresIn: '2h',
    expirationDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  '2d': {
    expiresIn: '2d',
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  '2w': {
    expiresIn: '2w',
    expirationDate: new Date(Date.now() + 2 * 7 * 24 * 60 * 60 * 1000),
  },
  '2m': {
    expiresIn: '2m',
    expirationDate: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000),
  },
  '2y': {
    expiresIn: '2y',
    expirationDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
  },
  '10m': {
    expiresIn: '10m',
    expirationDate: new Date(Date.now() + 10 * 60 * 1000),
  },
};
