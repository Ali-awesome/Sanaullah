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

export async function fetchPosts() {
  const res = await fetch(`${BASE}/posts`);
  if (!res.ok) throw new Error("Failed to load posts");
  return res.json();
}

export async function fetchGallery() {
  const res = await fetch(`${BASE}/gallery`);
  if (!res.ok) throw new Error("Failed to load gallery");
  return res.json();
}

// --- Admin (requires an x-admin-token header) ---

export async function fetchContactMessages(token) {
  const res = await fetch(`${BASE}/contact`, { headers: { "x-admin-token": token } });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Failed to load messages");
  return res.json();
}

export async function createPost(payload, token) {
  const res = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify(payload),
  });
  return asJson(res, [201]);
}

export async function updatePost(id, payload, token) {
  const res = await fetch(`${BASE}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify(payload),
  });
  return asJson(res, [200]);
}

export async function reorderPosts(ids, token) {
  const res = await fetch(`${BASE}/posts/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify({ ids }),
  });
  return asJson(res, [200]);
}

export async function deletePost(id, token) {
  const res = await fetch(`${BASE}/posts/${id}`, {
    method: "DELETE",
    headers: { "x-admin-token": token },
  });
  return asJson(res, [200]);
}

export async function createGalleryPhoto(payload, token) {
  const res = await fetch(`${BASE}/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify(payload),
  });
  return asJson(res, [201]);
}

export async function updateGalleryPhoto(id, payload, token) {
  const res = await fetch(`${BASE}/gallery/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify(payload),
  });
  return asJson(res, [200]);
}

export async function reorderGalleryPhotos(ids, token) {
  const res = await fetch(`${BASE}/gallery/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify({ ids }),
  });
  return asJson(res, [200]);
}

export async function deleteGalleryPhoto(id, token) {
  const res = await fetch(`${BASE}/gallery/${id}`, {
    method: "DELETE",
    headers: { "x-admin-token": token },
  });
  return asJson(res, [200]);
}
