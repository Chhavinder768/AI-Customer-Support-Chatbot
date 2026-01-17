import { Context, Next } from "hono";

const requests = new Map<string, number>();

export async function rateLimit(c: Context, next: Next) {
  const ip = c.req.header("x-forwarded-for") ?? "unknown";
  const now = Date.now();

  const lastRequest = requests.get(ip) ?? 0;
  if (now - lastRequest < 500) {
    return c.json({ error: "Too many requests" }, 429);
  }

  requests.set(ip, now);
  await next();
}
