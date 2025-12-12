import z from 'zod';
import { CONFIG } from '@/lib/config';
import { createDebug } from '@/lib/debug';
import type { Project } from '@/types/vercel-sdk';

const MAX_PROJECTS = 150;

const debug = createDebug('lazyvercel:projects');

export const fetchProjects = async (teamId: string) => {
  const url = 'https://api.vercel.com/v10/projects';
  const searchParams = new URLSearchParams({
    teamId,
    limit: MAX_PROJECTS.toString(),
  });

  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${CONFIG.get().bearerToken}` },
    body: undefined,
  };

  const full = `${url}?${searchParams.toString()}`;
  debug('fetch', { teamId, url: full });
  const response = await fetch(full, options);

  if (!response.ok) {
    const error = await response.json();
    debug('fetch failed', { status: response.status, error });

    const { data: parsed } = z
      .object({ error: z.object({ message: z.string() }) })
      .safeParse(error);

    throw new Error('Failed to fetch projects', {
      cause: parsed?.error.message,
    });
  }

  const data = (await response.json()) as { projects: Array<Project> };

  return data.projects;
};
