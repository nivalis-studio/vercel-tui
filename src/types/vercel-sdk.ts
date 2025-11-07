import type { Vercel } from '@vercel/sdk';

type VercelClient = Vercel;

export type Deployments = Awaited<
  ReturnType<VercelClient['deployments']['getDeployments']>
>['deployments'];
export type Deployment = Deployments[number];
export type Projects = Awaited<
  ReturnType<VercelClient['projects']['getProjects']>
>['projects'];
export type Project = Projects[number];
