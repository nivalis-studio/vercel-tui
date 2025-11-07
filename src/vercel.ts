import { Vercel } from '@vercel/sdk';
import { getConfig } from '@/lib/config';

let vercelInstance: Vercel | null = null;

export const resetVercelInstance = (): void => {
  vercelInstance = null;
};

export const getVercel = (): Vercel => {
  if (vercelInstance) {
    return vercelInstance;
  }

  const config = getConfig();

  if (!config?.bearerToken) {
    throw new Error('Bearer token not configured');
  }

  vercelInstance = new Vercel({
    bearerToken: config.bearerToken,
  });

  return vercelInstance;
};
