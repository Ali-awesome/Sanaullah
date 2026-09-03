import { useEffect, useState } from "react";
import {
  fetchContactMessages,
  postsClient,
  galleryClient,
  portfolioProjectsClient,
  fetchCvMeta,
  uploadCv,
} from "../../api/client.js";
import { useOrderedAdminResource } from "../../hooks/useOrderedAdminResource.js";
import AdminOrderedList from "./AdminOrderedList.jsx";

const TOKEN_KEY = "portfolio_admin_token";
const BLANK_POST = { title: "", source: "", date: "", summary: "", image: "", link: "" };
const BLANK_PHOTO = { name: "", image: "", description: "" };
const BLANK_PROJECT = { title: "", category: "", client: "", date: "", image: "", summary: "", link: "" };

const inputClass =
  "mb-3 block w-full rounded-md border border-[#ddd] px-3 py-[10px] font-[inherit] text-[15px] focus:border-black/50 focus:outline-none";
const buttonClass =
  "block w-full rounded-md border-none bg-black px-4 py-[10px] font-[inherit] text-white disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButtonClass =
  "block w-full rounded-md border border-[#ddd] bg-white px-4 py-[10px] font-[inherit] text-black";

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");
  const [cvMeta, setCvMeta] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  // The contact-inbox fetch is the only one gated on the admin token — a
  // failure there means the token itself is bad (or was revoked), so that's
  // the only case that should log the admin out. Everything else is a
  // public, unauthenticated read: a transient network hiccup on any of
  // those used to force a valid, logged-in admin back out to the token
  // screen too.
  const load = (activeToken) => {
    setError("");
    fetchContactMessages(activeToken)
      .then(setMessages)
      .catch((err) => {
        setError(err.message);
        setMessages(null);
        sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
      });
    postsClient.fetchAll().then(posts.setItems).catch((err) => setError(err.message));
    galleryClient.fetchAll().then(gallery.setItems).catch((err) => setError(err.message));
    portfolioProjectsClient.fetchAll().then(portfolioProjects.setItems).catch((err) => setError(err.message));
    fetchCvMeta().then(setCvMeta).catch(() => {});
  };

  const posts = useOrderedAdminResource({
    client: postsClient,
    blankForm: BLANK_POST,
    token,
    onError: setError,
    afterChange: () => load(token),
  });
  const gallery = useOrderedAdminResource({
    client: galleryClient,
    blankForm: BLANK_PHOTO,
    token,
    onError: setError,
    afterChange: () => load(token),
  });
  const portfolioProjects = useOrderedAdminResource({
    client: portfolioProjectsClient,
    blankForm: BLANK_PROJECT,
    token,
    onError: setError,
    afterChange: () => load(token),
  });
  const existingCategories = [...new Set((portfolioProjects.items || []).map((p) => p.category))];

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
  };

  const handleUploadCv = async (e) => {
    e.preventDefault();
    if (!cvFile) return;
    setUploadingCv(true);
    setError("");
    try {
      const result = await uploadCv(cvFile, token);
      setCvMeta(result.data);
      setCvFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingCv(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen justify-center bg-[#f8f8f8] p-10 font-sans">
        <form className="h-fit w-full max-w-[400px] rounded-lg bg-white p-[30px]" onSubmit={handleLogin}>
          <h2 className="mb-[10px] mt-0 text-2xl font-semibold">Admin Login</h2>
          <p className="mb-3 text-sm text-[#767676]">Enter the ADMIN_TOKEN configured on the backend.</p>
          <input
            className={inputClass}
            type="password"
            placeholder="Admin token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <button className={buttonClass} type="submit">
            Enter
          </button>
          {error && <p className="text-sm text-[#c0392b]">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#f8f8f8] p-10 font-sans">
      <div className="h-fit w-full max-w-[900px] rounded-lg bg-white p-[30px]">
        <div className="flex items-center justify-between">
          <h2 className="mb-[10px] mt-0 text-2xl font-semibold">Admin Panel</h2>
          <button className="cursor-pointer border-none bg-transparent underline" onClick={handleLogout}>
            Log out
          </button>
        </div>
        {error && <p className="text-sm text-[#c0392b]">{error}</p>}

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">{posts.editingId ? "Edit Post" : "Add a Post"}</h3>
          <form onSubmit={posts.handleSubmit} className="flex flex-col gap-[10px]">
            <input
              className={inputClass}
              placeholder="Title"
              value={posts.form.title}
              onChange={(e) => posts.setForm({ ...posts.form, title: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Source (e.g. Personal Blog)"
              value={posts.form.source}
              onChange={(e) => posts.setForm({ ...posts.form, source: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Date (optional, e.g. September 2026)"
              value={posts.form.date}
              onChange={(e) => posts.setForm({ ...posts.form, date: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Image path (optional, defaults provided)"
              value={posts.form.image}
              onChange={(e) => posts.setForm({ ...posts.form, image: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Link (optional)"
              value={posts.form.link}
              onChange={(e) => posts.setForm({ ...posts.form, link: e.target.value })}
            />
            <textarea
              className={`${inputClass} min-h-[80px]`}
              placeholder="Summary"
              value={posts.form.summary}
              onChange={(e) => posts.setForm({ ...posts.form, summary: e.target.value })}
              required
            />
            <div className="flex gap-[10px]">
              <button className={buttonClass} type="submit" disabled={posts.saving}>
                {posts.saving ? "Saving…" : posts.editingId ? "Save Changes" : "Add Post"}
              </button>
              {posts.editingId && (
                <button type="button" className={secondaryButtonClass} onClick={posts.cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">Posts ({posts.items ? posts.items.length : "…"})</h3>
          <p className="mb-3 text-sm text-[#767676]">
            Drag to reorder — this is the order they'll appear in on the site.
          </p>
          <AdminOrderedList
            resource={posts}
            itemLabel={(p) => `"${p.title}"`}
            renderContent={(p) => (
              <div>
                <strong>{p.title}</strong>
                <div className="text-sm text-[#767676]">
                  {p.source}
                  {p.date ? ` — ${p.date}` : ""}
                </div>
              </div>
            )}
          />
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">
            {gallery.editingId ? "Edit Gallery Photo" : "Add a Gallery Photo"}
          </h3>
          <p className="mb-3 text-sm text-[#767676]">
            Shows in the Portfolio section's "All" tab. Paste a path already under frontend/public/img/ (e.g.
            /img/portfolio/7.jpg) or any image URL — see the README for how to add new image files.
          </p>
          <form onSubmit={gallery.handleSubmit} className="flex flex-col gap-[10px]">
            <input
              className={inputClass}
              placeholder="Name"
              value={gallery.form.name}
              onChange={(e) => gallery.setForm({ ...gallery.form, name: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Image path or URL"
              value={gallery.form.image}
              onChange={(e) => gallery.setForm({ ...gallery.form, image: e.target.value })}
              required
            />
            <textarea
              className={`${inputClass} min-h-[60px]`}
              placeholder="Description (optional) — shown when a visitor opens the photo"
              value={gallery.form.description}
              onChange={(e) => gallery.setForm({ ...gallery.form, description: e.target.value })}
            />
            <div className="flex gap-[10px]">
              <button className={buttonClass} type="submit" disabled={gallery.saving}>
                {gallery.saving ? "Saving…" : gallery.editingId ? "Save Changes" : "Add Photo"}
              </button>
              {gallery.editingId && (
                <button type="button" className={secondaryButtonClass} onClick={gallery.cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">
            Gallery Photos ({gallery.items ? gallery.items.length : "…"})
          </h3>
          <p className="mb-3 text-sm text-[#767676]">
            Drag to reorder — this is the order they'll appear in under Portfolio's "All" tab.
          </p>
          <AdminOrderedList
            resource={gallery}
            itemLabel={(g) => `"${g.name}"`}
            renderContent={(g) => (
              <div className="flex items-center gap-3">
                <img src={g.image} alt="" className="h-11 w-11 rounded object-cover" />
                <strong>{g.name}</strong>
              </div>
            )}
          />
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">
            {portfolioProjects.editingId ? "Edit Portfolio Project" : "Add a Portfolio Project"}
          </h3>
          <p className="mb-3 text-sm text-[#767676]">
            These are the category tabs under Portfolio (Data Analytics, AI/ML, etc.) — separate from the photo
            gallery above. The category you type becomes (or reuses) a tab automatically.
          </p>
          <form onSubmit={portfolioProjects.handleSubmit} className="flex flex-col gap-[10px]">
            <input
              className={inputClass}
              placeholder="Title"
              value={portfolioProjects.form.title}
              onChange={(e) => portfolioProjects.setForm({ ...portfolioProjects.form, title: e.target.value })}
              required
            />
            <input
              className={inputClass}
              list="portfolio-categories"
              placeholder="Category (e.g. Data Analytics, AI/ML)"
              value={portfolioProjects.form.category}
              onChange={(e) => portfolioProjects.setForm({ ...portfolioProjects.form, category: e.target.value })}
              required
            />
            <datalist id="portfolio-categories">
              {existingCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <input
              className={inputClass}
              placeholder="Client (optional)"
              value={portfolioProjects.form.client}
              onChange={(e) => portfolioProjects.setForm({ ...portfolioProjects.form, client: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Date (optional, e.g. January 2026)"
              value={portfolioProjects.form.date}
              onChange={(e) => portfolioProjects.setForm({ ...portfolioProjects.form, date: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Image path (optional, defaults provided)"
              value={portfolioProjects.form.image}
              onChange={(e) => portfolioProjects.setForm({ ...portfolioProjects.form, image: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Link to original work (optional)"
              value={portfolioProjects.form.link}
              onChange={(e) => portfolioProjects.setForm({ ...portfolioProjects.form, link: e.target.value })}
            />
            <textarea
              className={`${inputClass} min-h-[80px]`}
              placeholder="Summary"
              value={portfolioProjects.form.summary}
              onChange={(e) => portfolioProjects.setForm({ ...portfolioProjects.form, summary: e.target.value })}
              required
            />
            <div className="flex gap-[10px]">
              <button className={buttonClass} type="submit" disabled={portfolioProjects.saving}>
                {portfolioProjects.saving ? "Saving…" : portfolioProjects.editingId ? "Save Changes" : "Add Project"}
              </button>
              {portfolioProjects.editingId && (
                <button type="button" className={secondaryButtonClass} onClick={portfolioProjects.cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">
            Portfolio Projects ({portfolioProjects.items ? portfolioProjects.items.length : "…"})
          </h3>
          <p className="mb-3 text-sm text-[#767676]">Drag to reorder within each category tab.</p>
          <AdminOrderedList
            resource={portfolioProjects}
            itemLabel={(p) => `"${p.title}"`}
            renderContent={(p) => (
              <div>
                <strong>{p.title}</strong>
                <div className="text-sm text-[#767676]">
                  {p.category}
                  {p.date ? ` — ${p.date}` : ""}
                </div>
              </div>
            )}
          />
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">CV</h3>
          <p className="mb-3 text-sm text-[#767676]">
            {cvMeta
              ? `Current file: ${cvMeta.filename} (uploaded ${new Date(cvMeta.uploadedAt).toLocaleString()})`
              : "Loading current CV…"}
            {" "}Uploading a new one replaces it everywhere the site links to "Download CV".
          </p>
          <form onSubmit={handleUploadCv} className="flex flex-col gap-[10px]">
            <input
              className={inputClass}
              type="file"
              accept="application/pdf"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />
            <button className={buttonClass} type="submit" disabled={uploadingCv || !cvFile}>
              {uploadingCv ? "Uploading…" : "Upload New CV"}
            </button>
          </form>
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">Contact Inbox ({messages ? messages.length : "…"})</h3>
          {messages?.length === 0 && <p className="text-sm text-[#767676]">No messages yet.</p>}
          {messages?.map((m, i) => (
            <div key={i} className="flex items-start justify-between border-b border-[#f0f0f0] py-3">
              <div>
                <strong>
                  {m.name} &lt;{m.email}&gt;
                </strong>
                <div className="text-sm text-[#767676]">{new Date(m.createdAt).toLocaleString()}</div>
                <p>{m.message}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
