import { COOKIES_STORAGE } from "@/constants";
import type { ApiError } from "@/types";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IMPORT_POLL_MS,
  IMPORT_SSE_MAX_FAILURES,
  IMPORT_UI_THROTTLE_MS,
  isTerminalImportStatus,
} from "../constants/import.constant";
import { contactImportService } from "../services/contact-import.service";
import { readSseStream } from "../services/sse-client";
import type { ImportJobDoc } from "../types/import.schema";
import {
  becameTerminal,
  mergeJobSnapshot,
  parseJobSnapshot,
  parseSseSnapshot,
} from "../utils/job-snapshot";

export type ImportJobTransport = "sse" | "poll";

export function useImportJob(accountId: string | undefined, jobId: string | undefined) {
  const [job, setJob] = useState<ImportJobDoc | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [transport, setTransport] = useState<ImportJobTransport>("sse");

  const pendingRef = useRef<ImportJobDoc | null>(null);
  const lastFlushRef = useRef(0);
  const failCountRef = useRef(0);
  const jobRef = useRef<ImportJobDoc | null>(null);

  const flush = useCallback((next: ImportJobDoc, force = false) => {
    jobRef.current = next;
    const now = Date.now();
    if (!force && now - lastFlushRef.current < IMPORT_UI_THROTTLE_MS) {
      pendingRef.current = next;
      return;
    }
    lastFlushRef.current = now;
    pendingRef.current = null;
    setJob(next);
  }, []);

  const load = useCallback(async () => {
    if (!accountId || !jobId) {
      return null;
    }
    const next = await contactImportService.getJob(accountId, jobId);
    flush(next, true);
    setError(null);
    return next;
  }, [accountId, jobId, flush]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (pendingRef.current) {
        flush(pendingRef.current, true);
      }
    }, IMPORT_UI_THROTTLE_MS);
    return () => window.clearInterval(timer);
  }, [flush]);

  useEffect(() => {
    if (!accountId || !jobId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const abort = new AbortController();
    failCountRef.current = 0;
    setTransport("sse");
    setLoading(true);

    const applySnapshotJson = (raw: string) => {
      try {
        const json: unknown = JSON.parse(raw);
        const full = parseJobSnapshot(json);
        const patch = parseSseSnapshot(json);
        const next = full ?? (patch ? mergeJobSnapshot(jobRef.current, patch) : null);
        if (!next) {
          return;
        }
        const previous = jobRef.current;
        flush(next);
        setError(null);
        if (becameTerminal(previous, next)) {
          void load();
        }
      } catch {
        /* ignore malformed frames */
      }
    };

    let pollTimer: number | undefined;
    const stopPollTimer = () => {
      if (pollTimer !== undefined) {
        window.clearInterval(pollTimer);
        pollTimer = undefined;
      }
    };

    const poll = async () => {
      if (cancelled) {
        return;
      }
      if (jobRef.current && isTerminalImportStatus(jobRef.current.status)) {
        stopPollTimer();
        abort.abort();
        return;
      }
      try {
        const next = await contactImportService.getJob(accountId, jobId);
        if (!cancelled) {
          flush(next);
          setError(null);
          if (isTerminalImportStatus(next.status)) {
            abort.abort();
            stopPollTimer();
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as ApiError);
        }
      }
    };

    const startPolling = () => {
      setTransport("poll");
      void poll();
    };

    const connect = async () => {
      try {
        const initial = await contactImportService.getJob(accountId, jobId);
        if (cancelled) {
          return;
        }
        flush(initial, true);
        setLoading(false);
        if (isTerminalImportStatus(initial.status)) {
          stopPollTimer();
          return;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as ApiError);
          setLoading(false);
        }
        return;
      }

      const token = CookieUtils.getItem<string>(COOKIES_STORAGE.auth_token);
      const headers: Record<string, string> = {};
      if (typeof token === "string" && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      while (!cancelled && !abort.signal.aborted) {
        if (failCountRef.current >= IMPORT_SSE_MAX_FAILURES || transportRefIsPoll()) {
          startPolling();
          break;
        }
        const result = await readSseStream(
          contactImportService.eventsUrl(accountId, jobId),
          headers,
          abort.signal,
          {
            onEvent: (event, data) => {
              if (event === "snapshot") {
                applySnapshotJson(data);
              }
            },
          },
        );
        if (cancelled || abort.signal.aborted) {
          break;
        }
        const latest = jobRef.current;
        if (latest && isTerminalImportStatus(latest.status)) {
          break;
        }
        if (result === "blocked") {
          failCountRef.current = IMPORT_SSE_MAX_FAILURES;
          startPolling();
          break;
        }
        failCountRef.current += 1;
        const backoff = Math.min(8000, 500 * 2 ** (failCountRef.current - 1));
        await wait(backoff, abort.signal);
      }
    };

    const transportRefIsPoll = () => failCountRef.current >= IMPORT_SSE_MAX_FAILURES;

    void connect();

    pollTimer = window.setInterval(() => {
      if (failCountRef.current >= IMPORT_SSE_MAX_FAILURES) {
        void poll();
      }
    }, IMPORT_POLL_MS);

    return () => {
      cancelled = true;
      abort.abort();
      stopPollTimer();
    };
  }, [accountId, jobId, flush, load]);

  return { job, error, loading, transport, reload: load };
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}
