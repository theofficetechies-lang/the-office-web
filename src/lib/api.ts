/**
 * Production-grade API client for THE OFFICE studio.
 * Handles timeouts, retries, and structured error parsing.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const DEFAULT_TIMEOUT = 10_000;
const MAX_RETRIES = 1;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public issues?: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...rest } = init;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(input, { ...rest, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchWithRetry(
  input: RequestInfo,
  init: RequestInit & { timeout?: number } = {},
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    return await fetchWithTimeout(input, init);
  } catch (err) {
    if (retries > 0 && err instanceof Error && err.name !== "AbortError") {
      await new Promise((r) => setTimeout(r, 800));
      return fetchWithRetry(input, init, retries - 1);
    }
    throw err;
  }
}

export interface BriefPayload {
  name: string;
  email: string;
  org?: string;
  service?: string;
  timeline?: string;
  budget?: string;
  discovery?: string;
  brief: string;
  company_website?: string;
}

export interface BriefResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  error?: string;
  issues?: Array<{ path: string; message: string }>;
}

export async function submitBrief(payload: BriefPayload): Promise<BriefResponse> {
  const res = await fetchWithRetry(`${API_BASE}/api/brief`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    timeout: DEFAULT_TIMEOUT,
  });

  const data: BriefResponse = await res.json().catch(() => ({
    success: false,
    error: "Invalid response from server",
  }));

  if (!res.ok) {
    throw new ApiError(
      data.error ?? `Request failed (${res.status})`,
      res.status,
      undefined,
      data.issues
    );
  }

  return data;
}

export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
  checks: Record<string, boolean>;
}> {
  const res = await fetchWithTimeout(`${API_BASE}/api/health`, {
    method: "GET",
    timeout: 5_000,
  });

  if (!res.ok) {
    throw new ApiError("Health check failed", res.status);
  }

  return res.json();
}
