import type { vercel } from '@/vercel';

export type Deployments = Awaited<
  ReturnType<typeof vercel.deployments.getDeployments>
>['deployments'];
export type Deployment = Deployments[number];
export type Projects = Awaited<
  ReturnType<typeof vercel.projects.getProjects>
>['projects'];
export type Project = Projects[number];
