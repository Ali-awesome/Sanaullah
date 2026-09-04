import "dotenv/config";
import { createApp } from "../src/app.js";
import { buildRepositories } from "../src/infrastructure/buildRepositories.js";

/**
 * Vercel serverless entrypoint (see backend/vercel.json, which routes every
 * request here). A serverless function may be reused ("warm") across
 * requests on the same instance, or may cold-start fresh at any time — so
 * the Express app and its DB connection are built once and cached at
 * module scope (`appPromise`), not per-request. On a cold start, MongoDB
 * must be reachable via MONGODB_URI: the in-memory repository fallback
 * that's convenient for local dev is NOT durable here, since a fresh
 * instance starts with empty memory and instances aren't shared across
 * regions/scale-to-zero cycles. Set MONGODB_URI for any real deployment.
 */
let appPromise;

async function buildApp() {
  const repositories = await buildRepositories({
    onFallback: () =>
      console.warn("[api] No MongoDB connection — using in-memory storage, which will NOT persist between invocations."),
  });
  return createApp({ ...repositories, clientOrigin: process.env.CLIENT_ORIGIN });
}

export default async function handler(req, res) {
  if (!appPromise) appPromise = buildApp();
  let app;
  try {
    app = await appPromise;
  } catch (err) {
    // Don't leave a rejected promise cached: without this, one failed
    // cold start (e.g. a transient DB blip) would permanently fail every
    // request on this warm instance instead of just retrying next time.
    appPromise = undefined;
    console.error("[api] Failed to build the app:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, message: "Server failed to start. Please try again." }));
    return;
  }
  return app(req, res);
}
