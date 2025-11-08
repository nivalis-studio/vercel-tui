import { Vercel } from '@vercel/sdk';
import { getConfig } from '@/lib/config';

let vercelInstance: Vercel | null = null;

export const resetVercelInstance = (): void => {
  vercelInstance = null;
};

export const getToken = (): string => {
  const config = getConfig();

  if (!config?.bearerToken) {
    throw new Error('Bearer token not configured');
  }

  return config.bearerToken;
};

export const getVercel = (): Vercel => {
  if (vercelInstance) {
    return vercelInstance;
  }

  vercelInstance = new Vercel({
    bearerToken: getToken(),
  });

  return vercelInstance;
};
