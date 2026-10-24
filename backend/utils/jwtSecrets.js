const developmentSecrets = {
  JWT_SECRET: 'secret123',
  JWT_REFRESH_SECRET: 'refreshsecret123',
};

export const getJwtSecret = (name) => {
  const configured = process.env[name];
  if (configured) return configured;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} must be configured in production.`);
  }
  return developmentSecrets[name];
};

export const validateJwtSecrets = () => {
  if (process.env.NODE_ENV !== 'production') return;
  for (const name of Object.keys(developmentSecrets)) {
    if (typeof process.env[name] !== 'string' || process.env[name].length < 32) {
      throw new Error(`${name} must be set to at least 32 characters in production.`);
    }
  }
  if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different values.');
  }
  if (!process.env.CLIENT_URL && !process.env.CLIENT_ORIGINS) {
    throw new Error('CLIENT_URL or CLIENT_ORIGINS must be configured in production.');
  }
};
