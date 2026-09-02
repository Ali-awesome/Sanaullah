import { useEffect, useState } from "react";
import { FaGripVertical, FaChevronUp, FaChevronDown } from "react-icons/fa";
import {
  fetchContactMessages,
  fetchPosts,
  createPost,
  updatePost,
  reorderPosts,
  deletePost,
  fetchGallery,
  createGalleryPhoto,
  updateGalleryPhoto,
  reorderGalleryPhotos,
  deleteGalleryPhoto,
} from "../../api/client.js";

const TOKEN_KEY = "portfolio_admin_token";
const BLANK_POST = { title: "", source: "", date: "", summary: "", image: "", link: "" };
const BLANK_PHOTO = { name: "", image: "" };

const inputClass =
  "mb-3 block w-full rounded-md border border-[#ddd] px-3 py-[10px] font-[inherit] text-[15px] focus:border-black/50 focus:outline-none";
const buttonClass =
  "block w-full rounded-md border-none bg-black px-4 py-[10px] font-[inherit] text-white disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButtonClass =
  "block w-full rounded-md border border-[#ddd] bg-white px-4 py-[10px] font-[inherit] text-black";
const smallButtonClass = "h-fit rounded-md border border-[#ddd] bg-white px-3 py-[6px]";
const iconButtonClass = "flex h-7 w-7 items-center justify-center rounded-md border border-[#ddd] bg-white disabled:cursor-not-allowed disabled:opacity-40";
const dangerButtonClass = "h-fit rounded-md border border-[#c0392b] bg-white px-3 py-[6px] text-[#c0392b]";

// Swaps the item at `index` with its neighbor in `direction` (-1 up, +1
// down); returns the array unchanged if already at that end. Shared by both
// the drag handles' drop logic (via array splice, see below) and the
// keyboard-accessible move buttons — dragging isn't operable without a
// mouse/touch, so the arrows are the only way to reorder without one.
function moveItem(list, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [messages, setMessages] = useState(null);
  const [posts, setPosts] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(BLANK_POST);
  const [photoForm, setPhotoForm] = useState(BLANK_PHOTO);
  const [saving, setSaving] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  // null = the form above is creating a new post/photo; otherwise it's the
  // id of the one currently being edited, and the same form/submit handler
  // updates it in place instead of creating a new one.
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPhotoId, setEditingPhotoId] = useState(null);

  // The contact-inbox fetch is the only one gated on the admin token — a
  // failure there means the token itself is bad (or was revoked), so that's
  // the only case that should log the admin out. Posts/gallery are public,
  // unauthenticated endpoints: a transient network hiccup on either of those
  // used to force a valid, logged-in admin back out to the token screen too.
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
    fetchPosts()
      .then(setPosts)
      .catch((err) => setError(err.message));
    fetchGallery()
      .then(setGallery)
      .catch((err) => setError(err.message));
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

  const startEditPost = (post) => {
    setEditingPostId(post.id);
    setForm({
      title: post.title || "",
      source: post.source || "",
      date: post.date || "",
      summary: post.summary || "",
      image: post.image || "",
      link: post.link || "",
    });
    setError("");
  };

  const cancelEditPost = () => {
    setEditingPostId(null);
    setForm(BLANK_POST);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingPostId) {
        await updatePost(editingPostId, form, token);
      } else {
        await createPost(form, token);
      }
      setForm(BLANK_POST);
      setEditingPostId(null);
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
      if (editingPostId === id) cancelEditPost();
      load(token);
    } catch (err) {
      setError(err.message);
    }
  };

  // Dragging reorders the local list live (as you drag over another row) so
  // the drop target is obvious; the actual persist call only fires once, on
  // drop. `dragged` tracks which row's grip is currently being dragged.
  const [draggedPostId, setDraggedPostId] = useState(null);

  const persistPostOrder = async (ordered) => {
    try {
      await reorderPosts(ordered.map((p) => p.id), token);
    } catch (err) {
      setError(err.message);
      load(token); // the write failed — resync with what the server actually has
    }
  };

  const handlePostDragOver = (overId) => (e) => {
    e.preventDefault();
    if (draggedPostId === null || draggedPostId === overId) return;
    setPosts((current) => {
      const from = current.findIndex((p) => p.id === draggedPostId);
      const to = current.findIndex((p) => p.id === overId);
      if (from === -1 || to === -1 || from === to) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handlePostDrop = () => {
    if (draggedPostId === null) return;
    setDraggedPostId(null);
    persistPostOrder(posts);
  };

  const movePost = (index, direction) => {
    const next = moveItem(posts, index, direction);
    if (next === posts) return;
    setPosts(next);
    persistPostOrder(next);
  };

  const startEditPhoto = (photo) => {
    setEditingPhotoId(photo.id);
    setPhotoForm({ name: photo.name || "", image: photo.image || "" });
    setError("");
  };

  const cancelEditPhoto = () => {
    setEditingPhotoId(null);
    setPhotoForm(BLANK_PHOTO);
  };

  const handleSubmitPhoto = async (e) => {
    e.preventDefault();
    setSavingPhoto(true);
    setError("");
    try {
      if (editingPhotoId) {
        await updateGalleryPhoto(editingPhotoId, photoForm, token);
      } else {
        await createGalleryPhoto(photoForm, token);
      }
      setPhotoForm(BLANK_PHOTO);
      setEditingPhotoId(null);
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
      if (editingPhotoId === id) cancelEditPhoto();
      load(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const [draggedPhotoId, setDraggedPhotoId] = useState(null);

  const persistPhotoOrder = async (ordered) => {
    try {
      await reorderGalleryPhotos(ordered.map((p) => p.id), token);
    } catch (err) {
      setError(err.message);
      load(token); // the write failed — resync with what the server actually has
    }
  };

  const handlePhotoDragOver = (overId) => (e) => {
    e.preventDefault();
    if (draggedPhotoId === null || draggedPhotoId === overId) return;
    setGallery((current) => {
      const from = current.findIndex((p) => p.id === draggedPhotoId);
      const to = current.findIndex((p) => p.id === overId);
      if (from === -1 || to === -1 || from === to) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handlePhotoDrop = () => {
    if (draggedPhotoId === null) return;
    setDraggedPhotoId(null);
    persistPhotoOrder(gallery);
  };

  const movePhoto = (index, direction) => {
    const next = moveItem(gallery, index, direction);
    if (next === gallery) return;
    setGallery(next);
    persistPhotoOrder(next);
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
          <h3 className="mb-3 mt-0 text-lg font-semibold">{editingPostId ? "Edit Post" : "Add a Post"}</h3>
          <form onSubmit={handleSubmitPost} className="flex flex-col gap-[10px]">
            <input
              className={inputClass}
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Source (e.g. Personal Blog)"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Date (optional, e.g. September 2026)"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Image path (optional, defaults provided)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Link (optional)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <textarea
              className={`${inputClass} min-h-[80px]`}
              placeholder="Summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              required
            />
            <div className="flex gap-[10px]">
              <button className={buttonClass} type="submit" disabled={saving}>
                {saving ? "Saving…" : editingPostId ? "Save Changes" : "Add Post"}
              </button>
              {editingPostId && (
                <button type="button" className={secondaryButtonClass} onClick={cancelEditPost}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">Posts ({posts ? posts.length : "…"})</h3>
          <p className="mb-3 text-sm text-[#767676]">
            Drag the <FaGripVertical className="inline" aria-hidden="true" /> handle to reorder — this is the order
            they'll appear in on the site.
          </p>
          {posts?.map((p, i) => (
            <div
              key={p.id}
              draggable
              onDragStart={() => setDraggedPostId(p.id)}
              onDragOver={handlePostDragOver(p.id)}
              onDrop={handlePostDrop}
              onDragEnd={() => setDraggedPostId(null)}
              className={`flex items-start justify-between gap-3 border-b border-[#f0f0f0] py-3 ${
                draggedPostId === p.id ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <FaGripVertical className="mt-1 shrink-0 cursor-grab text-[#bbb] active:cursor-grabbing" aria-hidden="true" />
                <div>
                  <strong>{p.title}</strong>
                  <div className="text-sm text-[#767676]">
                    {p.source}
                    {p.date ? ` — ${p.date}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-[8px]">
                <button
                  className={iconButtonClass}
                  onClick={() => movePost(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move "${p.title}" up`}
                >
                  <FaChevronUp />
                </button>
                <button
                  className={iconButtonClass}
                  onClick={() => movePost(i, 1)}
                  disabled={i === posts.length - 1}
                  aria-label={`Move "${p.title}" down`}
                >
                  <FaChevronDown />
                </button>
                <button className={smallButtonClass} onClick={() => startEditPost(p)}>
                  Edit
                </button>
                <button className={dangerButtonClass} onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">{editingPhotoId ? "Edit Gallery Photo" : "Add a Gallery Photo"}</h3>
          <p className="mb-3 text-sm text-[#767676]">
            Shows in the Portfolio section's "All" tab. Paste a path already under frontend/public/img/ (e.g.
            /img/portfolio/7.jpg) or any image URL — see the README for how to add new image files.
          </p>
          <form onSubmit={handleSubmitPhoto} className="flex flex-col gap-[10px]">
            <input
              className={inputClass}
              placeholder="Name"
              value={photoForm.name}
              onChange={(e) => setPhotoForm({ ...photoForm, name: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Image path or URL"
              value={photoForm.image}
              onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.value })}
              required
            />
            <div className="flex gap-[10px]">
              <button className={buttonClass} type="submit" disabled={savingPhoto}>
                {savingPhoto ? "Saving…" : editingPhotoId ? "Save Changes" : "Add Photo"}
              </button>
              {editingPhotoId && (
                <button type="button" className={secondaryButtonClass} onClick={cancelEditPhoto}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-[30px] border-t border-[#eee] pt-5">
          <h3 className="mb-3 mt-0 text-lg font-semibold">Gallery Photos ({gallery ? gallery.length : "…"})</h3>
          <p className="mb-3 text-sm text-[#767676]">
            Drag the <FaGripVertical className="inline" aria-hidden="true" /> handle to reorder — this is the order
            they'll appear in under Portfolio's "All" tab.
          </p>
          {gallery?.map((g, i) => (
            <div
              key={g.id}
              draggable
              onDragStart={() => setDraggedPhotoId(g.id)}
              onDragOver={handlePhotoDragOver(g.id)}
              onDrop={handlePhotoDrop}
              onDragEnd={() => setDraggedPhotoId(null)}
              className={`flex items-start justify-between gap-3 border-b border-[#f0f0f0] py-3 ${
                draggedPhotoId === g.id ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <FaGripVertical className="shrink-0 cursor-grab text-[#bbb] active:cursor-grabbing" aria-hidden="true" />
                <img src={g.image} alt="" className="h-11 w-11 rounded object-cover" />
                <strong>{g.name}</strong>
              </div>
              <div className="flex shrink-0 gap-[8px]">
                <button
                  className={iconButtonClass}
                  onClick={() => movePhoto(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move "${g.name}" up`}
                >
                  <FaChevronUp />
                </button>
                <button
                  className={iconButtonClass}
                  onClick={() => movePhoto(i, 1)}
                  disabled={i === gallery.length - 1}
                  aria-label={`Move "${g.name}" down`}
                >
                  <FaChevronDown />
                </button>
                <button className={smallButtonClass} onClick={() => startEditPhoto(g)}>
                  Edit
                </button>
                <button className={dangerButtonClass} onClick={() => handleDeletePhoto(g.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
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
