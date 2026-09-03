// In local dev, "/api" is proxied to the backend by vite.config.js. In
// production the frontend and backend are usually on different domains/
// hosts, so set VITE_API_BASE_URL (e.g. https://your-backend.vercel.app/api)
// at build time — see the README's deployment section.
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function asJson(res, okStatuses = [200, 201]) {
  const data = await res.json().catch(() => ({}));
  if (!okStatuses.includes(res.status)) throw new Error(data.message || "Request failed");
  return data;
}

/**
 * Every admin-manageable list (posts, gallery photos, portfolio projects)
 * exposes the exact same list/create/update/reorder/delete shape on the
 * backend — this builds the matching client once instead of repeating the
 * five fetch() calls per resource.
 */
function makeOrderedResourceClient(path, label) {
  return {
    async fetchAll() {
      const res = await fetch(`${BASE}${path}`);
      if (!res.ok) throw new Error(`Failed to load ${label}`);
      return res.json();
    },
    async create(payload, token) {
      const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(payload),
      });
      return asJson(res, [201]);
    },
    async update(id, payload, token) {
      const res = await fetch(`${BASE}${path}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(payload),
      });
      return asJson(res, [200]);
    },
    async reorder(ids, token) {
      const res = await fetch(`${BASE}${path}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ ids }),
      });
      return asJson(res, [200]);
    },
    async remove(id, token) {
      const res = await fetch(`${BASE}${path}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      return asJson(res, [200]);
    },
  };
}

export const postsClient = makeOrderedResourceClient("/posts", "posts");
export const galleryClient = makeOrderedResourceClient("/gallery", "gallery");
export const portfolioProjectsClient = makeOrderedResourceClient("/portfolio-projects", "portfolio projects");

export async function fetchProfile() {
  const res = await fetch(`${BASE}/profile`);
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

export async function submitContact(payload) {
  const res = await fetch(`${BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return asJson(res, [201]);
}

// The CV lives on the backend now (so an admin upload can actually replace
// it — see UploadCv), not as a static frontend file, so "download" is just
// this URL rather than a value out of profile data. A plain <a href> works
// here without going through fetch() first.
export function cvDownloadUrl() {
  return `${BASE}/cv`;
}

export async function fetchCvMeta() {
  const res = await fetch(`${BASE}/cv/meta`);
  if (!res.ok) return null;
  return res.json();
}

// --- Admin (requires an x-admin-token header) ---

export async function fetchContactMessages(token) {
  const res = await fetch(`${BASE}/contact`, { headers: { "x-admin-token": token } });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Failed to load messages");
  return res.json();
}

// multipart/form-data, not JSON — browsers set the correct boundary in
// Content-Type automatically for a FormData body, so it must NOT be set
// manually here (doing so drops the boundary and the server can't parse it).
export async function uploadCv(file, token) {
  const formData = new FormData();
  formData.append("cv", file);
  const res = await fetch(`${BASE}/cv`, {
    method: "POST",
    headers: { "x-admin-token": token },
    body: formData,
  });
  return asJson(res, [201]);
}
