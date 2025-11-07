import theme from '@/theme/catppuccin.json' with { type: 'json' };
import type { Deployment } from '@/types/vercel-sdk';

export const getCreatedAt = (d: Deployment) => d.createdAt ?? d.created;

export const getBranch = (d: Deployment) =>
  d.meta?.githubCommitRef ||
  d.meta?.gitlabCommitRef ||
  d.meta?.bitbucketCommitRef ||
  d.meta?.commitRef ||
  d.meta?.branch ||
  '';

export const getCommit = (d: Deployment) => {
  const sha =
    d.meta?.githubCommitSha ||
    d.meta?.gitlabCommitSha ||
    d.meta?.bitbucketCommitSha ||
    d.meta?.commitSha ||
    '';
  return sha.substring(0, 7) || 'N/A';
};

export const getStatusInfo = (d: Deployment) => {
  const state = d.readyState || d.state || 'UNKNOWN';
  let fg = theme.defs.darkOverlay2;

  switch (state) {
    case 'READY':
      fg = theme.defs.darkGreen;
      break;
    case 'BUILDING':
    case 'INITIALIZING':
    case 'QUEUED':
      fg = theme.defs.darkYellow;
      break;
    case 'ERROR':
    case 'CANCELED':
    case 'DELETED':
      fg = theme.defs.darkRed;
      break;
    default:
      fg = theme.defs.darkOverlay2;
  }

  return { label: state, fg } as const;
};
