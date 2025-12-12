import { createDebug } from '@/lib/debug';
import { CONFIG } from './config';
import type { Deployment } from '@/types/vercel-sdk';

const MAX_DEPLOYMENTS = 150;

const debug = createDebug('lazyvercel:deployments');

export const fetchProjectDeployments = async (
  projectId: string,
  teamId: string,
) => {
  const vercel = CONFIG.getVercel();

  debug('fetch', { teamId, projectId, limit: MAX_DEPLOYMENTS });

  try {
    const data = await vercel.deployments.getDeployments({
      teamId,
      projectId,
      limit: MAX_DEPLOYMENTS,
    });

    return data.deployments;
  } catch (err) {
    debug('fetch failed', err);
    throw err;
  }
};

export const isDeploymentBuilding = (deployment: Deployment) =>
  deployment.readyState === 'BUILDING' ||
  deployment.readyState === 'INITIALIZING' ||
  deployment.readyState === 'QUEUED' ||
  deployment.state === 'BUILDING' ||
  deployment.state === 'INITIALIZING' ||
  deployment.state === 'QUEUED';
