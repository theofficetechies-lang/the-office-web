/**
 * Production-grade API client for THE OFFICE studio.
 * Handles timeouts, retries, structured error parsing,
 * and automatic fallback to Web3Forms for 100% email delivery.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const DEFAULT_TIMEOUT = 10_000;
const MAX_RETRIES = 1;
const WEB3FORMS_PUBLIC_KEY = "9c3fe5d9-088e-4c8c-80b9-5a2d3702d395";

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
  // Layer 1: Try the backend /api/brief endpoint first (handles rate limiting & serverless logic)
  try {
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

    if (res.ok) {
      return data;
    }
  } catch (err) {
    console.warn("[Client API] Backend endpoint unavailable, engaging direct Web3Forms fallback:", err);
  }

  // Layer 2: Automatic Direct Web3Forms delivery fallback
  try {
    const res = await fetchWithTimeout("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_PUBLIC_KEY,
        subject: `Brief from ${payload.name}${payload.org ? ` · ${payload.org}` : ""}`,
        from_name: "THE OFFICE Studio Web",
        name: payload.name,
        email: payload.email,
        organization: payload.org || "None",
        service: payload.service || "General Inquiry",
        timeline: payload.timeline || "Not specified",
        budget: payload.budget || "Not specified",
        discovery: payload.discovery || "Not specified",
        message: payload.brief,
      }),
      timeout: DEFAULT_TIMEOUT,
    });

    const data = await res.json().catch(() => null);
    if (data && data.success) {
      return {
        success: true,
        message: "Brief received. We reply within two working days.",
      };
    }
  } catch (fallbackErr) {
    console.error("[Client API] Direct delivery fallback failed:", fallbackErr);
  }

  throw new ApiError(
    "Unable to send brief automatically. Please email us directly at theofficetechies@gmail.com",
    500
  );
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
