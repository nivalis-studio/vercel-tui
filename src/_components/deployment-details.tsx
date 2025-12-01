import { type ScrollBoxRenderable, TextAttributes } from '@opentui/core';
import { useKeyboard } from '@opentui/react';
import open from 'open';
import { useEffect, useRef, useState } from 'react';
import { QUITTING_KEYS } from '@/constants';
import { useCtx } from '@/ctx';
import { CONFIG } from '@/lib/config';
import {
  getBranch,
  getCommit,
  getCreatedAt,
  getStatusInfo,
} from '@/lib/extract-deploy-details';
import type { Deployment } from '@/types/vercel-sdk';

type Props = {
  deployment: Deployment;
  focused: boolean;
  getFocus: () => void;
  onDeploymentUnselect: () => void;
};

export const DeploymentDetails = ({
  focused,
  getFocus,
  deployment,
  onDeploymentUnselect,
  ...props
}: Props) => {
  const { getColor, ...ctx } = useCtx();
  const status = getStatusInfo(deployment, ctx.theme);
  const branch = getBranch(deployment);
  const commit = getCommit(deployment, false);
  const createdAt = new Date(getCreatedAt(deployment));
  const scrollRef = useRef<ScrollBoxRenderable | null>(null);

  useKeyboard(key => {
    if (!focused) {
      return;
    }

    if (QUITTING_KEYS.includes(key.name)) {
      onDeploymentUnselect();
      return;
    }

    if (key.name === 'o') {
      const url = deployment.url;
      if (!url) {
        return;
      }

      open(url).catch(error => {
        console.error('Failed to open URL:', error);
      });
      return;
    }
  });

  return (
    <box
      borderColor={focused ? getColor('secondary') : getColor('borderSubtle')}
      borderStyle='rounded'
      flexDirection='column'
      height='100%'
      onMouseOver={getFocus}
      padding={1}
      title={deployment.uid}
      width='25%'
      {...props}
    >
      <scrollbox
        flexDirection='column'
        flexGrow={1}
        overflow='scroll'
        ref={scrollRef}
      >
        <box flexDirection='column' gap={1} padding={1}>
          <box flexDirection='column'>
            <text attributes={TextAttributes.DIM}>Status:</text>
            <text fg={status.fg}>{status.label}</text>
          </box>

          <box flexDirection='column'>
            <text attributes={TextAttributes.DIM}>Created:</text>
            <text>{createdAt.toLocaleString()}</text>
          </box>

          <box flexDirection='column'>
            <text attributes={TextAttributes.DIM}>URL:</text>
            <text>{deployment.url}</text>
          </box>

          <box marginTop={-1}>
            <text attributes={TextAttributes.DIM}>
              Press o to open in browser
            </text>
          </box>

          <box flexDirection='column'>
            <text attributes={TextAttributes.DIM}>Target:</text>
            <text>{deployment.target || 'N/A'}</text>
          </box>

          <box flexDirection='column'>
            <text attributes={TextAttributes.DIM}>Branch:</text>
            <text>{branch || 'N/A'}</text>
          </box>

          <box flexDirection='column'>
            <text attributes={TextAttributes.DIM}>Commit:</text>
            <text>{commit}</text>
          </box>

          <box marginTop={2}>
            <text attributes={TextAttributes.DIM}>q: back</text>
          </box>
        </box>
      </scrollbox>
    </box>
  );
};

type LogEvent = {
  type: string;
  created?: number;
  payload?: {
    created?: number;
    date?: number;
    serial?: string;
    text?: string;
    info?: {
      type?: string;
    };
  };
  text?: string;
};

export const DeploymentLogs = ({
  focused,
  getFocus,
  deployment,
  onDeploymentUnselect,
  ...props
}: Props) => {
  const { getColor, teamId } = useCtx();
  const scrollRef = useRef<ScrollBoxRenderable | null>(null);
  const [logs, setLogs] = useState<Array<LogEvent>>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  useKeyboard(key => {
    if (!focused) {
      return;
    }

    if (focused && QUITTING_KEYS.includes(key.name)) {
      onDeploymentUnselect();
      return;
    }
  });

  useEffect(() => {
    setLogs([]);
    setIsLoadingLogs(true);

    const isBuilding =
      deployment.readyState === 'BUILDING' ||
      deployment.readyState === 'INITIALIZING' ||
      deployment.readyState === 'QUEUED' ||
      deployment.state === 'BUILDING' ||
      deployment.state === 'INITIALIZING' ||
      deployment.state === 'QUEUED';

    let cancelled = false;
    let stopStreaming: (() => void) | undefined;

    const appendLogs = (newEntries: Array<LogEvent>) => {
      if (cancelled || newEntries.length === 0) {
        return;
      }

      setLogs(previous => [...previous, ...newEntries]);
    };

    const getLatestTimestamp = (events: Array<LogEvent>) =>
      events.reduce((latest, event) => {
        if (typeof event.created === 'number') {
          return Math.max(latest, event.created);
        }

        if (typeof event.payload?.created === 'number') {
          return Math.max(latest, event.payload.created);
        }

        return latest;
      }, 0);

    const startStreamingLogs = async (since?: number) => {
      try {
        const { bearerToken } = CONFIG.get();

        const params = new URLSearchParams({
          follow: '1',
          limit: '-1',
        });

        if (teamId) {
          params.set('teamId', teamId);
        }

        if (typeof since === 'number' && Number.isFinite(since) && since > 0) {
          params.set('since', String(since));
        }

        const controller = new AbortController();
        stopStreaming = () => controller.abort();

        const response = await fetch(
          `https://api.vercel.com/v3/deployments/${deployment.uid}/events?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              Accept: 'application/stream+json',
            },
            signal: controller.signal,
          },
        );

        if (cancelled || !response.body) {
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const handleSegment = (segment: string) => {
          const dataLines = segment
            .split('\n')
            .filter(line => line.startsWith('data:'))
            .map(line => line.slice(5).trim())
            .filter(Boolean);

          if (dataLines.length === 0) {
            return;
          }

          const payload = dataLines.join('\n');

          if (!payload || payload === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(payload);
            const entries = (Array.isArray(parsed) ? parsed : [parsed]).filter(
              (entry): entry is LogEvent =>
                Boolean(entry) && typeof entry === 'object',
            );

            appendLogs(entries);
          } catch (error) {
            console.error('Failed to parse streamed log event:', error);
          }
        };

        while (!cancelled) {
          // biome-ignore lint/performance/noAwaitInLoops: .
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const segments = buffer.split('\n\n');
          buffer = segments.pop() ?? '';

          for (const segment of segments) {
            handleSegment(segment);
          }
        }

        if (buffer) {
          const trailingSegments = buffer.split('\n\n');
          for (const segment of trailingSegments) {
            handleSegment(segment);
          }
        }
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') {
          return;
        }

        if (!cancelled) {
          console.error('Failed to stream logs:', error);
        }
      }
    };

    const fetchLogs = async () => {
      try {
        const vercel = CONFIG.getVercel();
        const response = await vercel.deployments.getDeploymentEvents({
          idOrUrl: deployment.uid,
          teamId,
          follow: 0,
          limit: -1,
        });

        if (cancelled) {
          return;
        }

        const events = Array.isArray(response)
          ? (response as Array<LogEvent>)
          : [];
        setLogs(events);
        setIsLoadingLogs(false);

        if (isBuilding) {
          const latestTimestamp = getLatestTimestamp(events);
          startStreamingLogs(latestTimestamp).catch(streamError => {
            console.error('Failed to start log stream:', streamError);
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch logs:', error);
          setIsLoadingLogs(false);
        }
      }
    };

    fetchLogs().catch(console.error);

    return () => {
      cancelled = true;
      stopStreaming?.();
    };
  }, [deployment.uid, deployment.readyState, deployment.state, teamId]);

  return (
    <box
      borderColor={focused ? getColor('secondary') : getColor('borderSubtle')}
      borderStyle='rounded'
      flexDirection='column'
      height='100%'
      onMouseOver={getFocus}
      padding={1}
      title={deployment.uid}
      {...props}
    >
      <scrollbox
        flexDirection='column'
        flexGrow={1}
        overflow='scroll'
        ref={scrollRef}
      >
        {isLoadingLogs && (
          <text attributes={TextAttributes.DIM}>Loading logs...</text>
        )}
        {!isLoadingLogs && logs.length === 0 && (
          <text attributes={TextAttributes.DIM}>No build logs available</text>
        )}
        {!isLoadingLogs &&
          logs.length > 0 &&
          logs.map((log, index) => {
            const logText = log.payload?.text || log.text || '';
            const logType = log.type;
            let fg = getColor('markdownText');

            if (logType === 'stderr') {
              fg = getColor('error');
            } else if (logType === 'command') {
              fg = getColor('markdownText');
            }

            const logKey = `${log.created || 0}-${index}`;

            return (
              <box flexDirection='row' key={logKey}>
                <text fg={fg}>{logText}</text>
              </box>
            );
          })}
      </scrollbox>
    </box>
  );
};
