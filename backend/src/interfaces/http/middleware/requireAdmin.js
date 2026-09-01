/**
 * Guards write/read-sensitive admin routes (managing posts, reading the
 * contact inbox) behind a shared-secret header, so the "add a blog post"
 * and "view messages" systems aren't open to the public internet.
 *
 * Set ADMIN_TOKEN in the backend's .env, then send it as the
 * `x-admin-token` header (the frontend's AdminPanel does this once you
 * enter the token there). If ADMIN_TOKEN isn't set, admin routes are
 * disabled entirely rather than left open.
 */
export function requireAdmin(req, res, next) {
  const configured = process.env.ADMIN_TOKEN;
  if (!configured) {
    return res.status(503).json({ success: false, message: "Admin access is not configured on this server." });
  }
  const provided = req.header("x-admin-token");
  if (provided !== configured) {
    return res.status(401).json({ success: false, message: "Invalid or missing admin token." });
  }
  next();
}
