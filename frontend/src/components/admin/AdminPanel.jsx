import { useEffect, useState } from "react";
import {
  fetchContactMessages,
  fetchPosts,
  createPost,
  deletePost,
  fetchGallery,
  createGalleryPhoto,
  deleteGalleryPhoto,
} from "../../api/client.js";

const TOKEN_KEY = "portfolio_admin_token";

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [messages, setMessages] = useState(null);
  const [posts, setPosts] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", source: "", date: "", summary: "", image: "", link: "" });
  const [photoForm, setPhotoForm] = useState({ name: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const load = (activeToken) => {
    setError("");
    Promise.all([fetchContactMessages(activeToken), fetchPosts(), fetchGallery()])
      .then(([m, p, g]) => {
        setMessages(m);
        setPosts(p);
        setGallery(g);
      })
      .catch((err) => {
        setError(err.message);
        setMessages(null);
        sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
      });
  };

  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem(TOKEN_KEY, tokenInput);
    setToken(tokenInput);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setMessages(null);
    setPosts(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createPost(form, token);
      setForm({ title: "", source: "", date: "", summary: "", image: "", link: "" });
      load(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id, token);
      load(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreatePhoto = async (e) => {
    e.preventDefault();
    setSavingPhoto(true);
    setError("");
    try {
      await createGalleryPhoto(photoForm, token);
      setPhotoForm({ name: "", image: "" });
      load(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    try {
      await deleteGalleryPhoto(id, token);
      load(token);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div style={styles.page}>
        <form style={styles.card} onSubmit={handleLogin}>
          <h2 style={styles.h2}>Admin Login</h2>
          <p style={styles.muted}>Enter the ADMIN_TOKEN configured on the backend.</p>
          <input
            style={styles.input}
            type="password"
            placeholder="Admin token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <button style={styles.button} type="submit">
            Enter
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 900 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={styles.h2}>Admin Panel</h2>
          <button style={styles.linkButton} onClick={handleLogout}>
            Log out
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}

        <section style={styles.section}>
          <h3 style={styles.h3}>Add a Post</h3>
          <form onSubmit={handleCreate} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Source (e.g. Personal Blog)"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Date (e.g. September 2026)"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Image path (optional, defaults provided)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Link (optional)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <textarea
              style={{ ...styles.input, minHeight: 80 }}
              placeholder="Summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              required
            />
            <button style={styles.button} type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add Post"}
            </button>
          </form>
        </section>

        <section style={styles.section}>
          <h3 style={styles.h3}>Posts ({posts ? posts.length : "…"})</h3>
          {posts?.map((p) => (
            <div key={p.id} style={styles.row}>
              <div>
                <strong>{p.title}</strong>
                <div style={styles.muted}>
                  {p.source} — {p.date}
                </div>
              </div>
              <button style={styles.dangerButton} onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          ))}
        </section>

        <section style={styles.section}>
          <h3 style={styles.h3}>Add a Gallery Photo</h3>
          <p style={styles.muted}>
            Shows in the Portfolio section's "All" tab. Paste a path already under frontend/public/img/ (e.g.
            /img/portfolio/7.jpg) or any image URL — see the README for how to add new image files.
          </p>
          <form onSubmit={handleCreatePhoto} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Name"
              value={photoForm.name}
              onChange={(e) => setPhotoForm({ ...photoForm, name: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Image path or URL"
              value={photoForm.image}
              onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.value })}
              required
            />
            <button style={styles.button} type="submit" disabled={savingPhoto}>
              {savingPhoto ? "Saving…" : "Add Photo"}
            </button>
          </form>
        </section>

        <section style={styles.section}>
          <h3 style={styles.h3}>Gallery Photos ({gallery ? gallery.length : "…"})</h3>
          {gallery?.map((g) => (
            <div key={g.id} style={styles.row}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={g.image} alt="" style={styles.thumb} />
                <strong>{g.name}</strong>
              </div>
              <button style={styles.dangerButton} onClick={() => handleDeletePhoto(g.id)}>
                Delete
              </button>
            </div>
          ))}
        </section>

        <section style={styles.section}>
          <h3 style={styles.h3}>Contact Inbox ({messages ? messages.length : "…"})</h3>
          {messages?.length === 0 && <p style={styles.muted}>No messages yet.</p>}
          {messages?.map((m, i) => (
            <div key={i} style={styles.row}>
              <div>
                <strong>
                  {m.name} &lt;{m.email}&gt;
                </strong>
                <div style={styles.muted}>{new Date(m.createdAt).toLocaleString()}</div>
                <p>{m.message}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f8f8",
    padding: "40px 20px",
    fontFamily: "Mulish, sans-serif",
    display: "flex",
    justifyContent: "center",
  },
  card: { background: "#fff", borderRadius: 8, padding: 30, width: "100%", maxWidth: 400, height: "fit-content" },
  h2: { margin: "0 0 10px" },
  h3: { margin: "0 0 12px" },
  muted: { color: "#767676", fontSize: 13 },
  error: { color: "#c0392b", fontSize: 13 },
  section: { marginTop: 30, borderTop: "1px solid #eee", paddingTop: 20 },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    font: "inherit",
    marginBottom: 12,
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px 16px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    font: "inherit",
  },
  linkButton: { background: "none", border: "none", textDecoration: "underline", cursor: "pointer" },
  dangerButton: {
    padding: "6px 12px",
    background: "#fff",
    color: "#c0392b",
    border: "1px solid #c0392b",
    borderRadius: 6,
    cursor: "pointer",
    height: "fit-content",
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #f0f0f0" },
  thumb: { width: 44, height: 44, objectFit: "cover", borderRadius: 4 },
};
