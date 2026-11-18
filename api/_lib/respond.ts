import type { VercelResponse } from "@vercel/node";

/**
 * Raw Node response helper. Vercel's ServerResponse does NOT have Express-style
 * `.status()` / `.json()`; calling them throws and the function crashes with
 * FUNCTION_INVOCATION_FAILED. Always use this instead.
 */
export function send(res: VercelResponse, code: number, obj: unknown) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

export function noContent(res: VercelResponse, code = 204) {
  res.statusCode = code;
  res.end();
}
