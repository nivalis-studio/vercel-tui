import { getVercel } from '@/vercel';

const MAX_DEPLOYMENTS = 150;

export const fetchProjectDeployments = async (
  projectId: string,
  teamId: string,
) => {
  const vercel = getVercel();

  const data = await vercel.deployments.getDeployments({
    teamId,
    projectId,
    limit: MAX_DEPLOYMENTS,
  });

  return data.deployments;
};
