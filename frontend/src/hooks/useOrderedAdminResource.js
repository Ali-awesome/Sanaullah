import { useState } from "react";

function moveItem(list, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/**
 * Encapsulates the state and handlers the admin panel's three manually-
 * orderable resource sections (posts, gallery photos, portfolio projects)
 * all need identically: an editable list, a create/edit form, drag-to-
 * reorder (plus the keyboard-operable move-up/move-down equivalent, since
 * dragging has no keyboard path at all), and save/delete. Each call site
 * only supplies its own API functions, blank form shape, and error
 * reporter — the actual state machine lives here once instead of being
 * copy-pasted per resource.
 */
export function useOrderedAdminResource({ client, blankForm, token, onError, afterChange }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...blankForm, ...item });
    onError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(blankForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    onError("");
    try {
      if (editingId) {
        await client.update(editingId, form, token);
      } else {
        await client.create(form, token);
      }
      setForm(blankForm);
      setEditingId(null);
      afterChange();
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.remove(id, token);
      if (editingId === id) cancelEdit();
      afterChange();
    } catch (err) {
      onError(err.message);
    }
  };

  const persistOrder = async (ordered) => {
    try {
      await client.reorder(ordered.map((item) => item.id), token);
    } catch (err) {
      onError(err.message);
      afterChange(); // the write failed — resync with what the server actually has
    }
  };

  // Dragging reorders the local list live (as you drag over another row) so
  // the drop target is obvious; the actual persist call only fires once, on
  // drop.
  const handleDragOver = (overId) => (e) => {
    e.preventDefault();
    if (draggedId === null || draggedId === overId) return;
    setItems((current) => {
      const from = current.findIndex((item) => item.id === draggedId);
      const to = current.findIndex((item) => item.id === overId);
      if (from === -1 || to === -1 || from === to) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleDrop = () => {
    if (draggedId === null) return;
    setDraggedId(null);
    persistOrder(items);
  };

  const move = (index, direction) => {
    const next = moveItem(items, index, direction);
    if (next === items) return;
    setItems(next);
    persistOrder(next);
  };

  return {
    items,
    setItems,
    form,
    setForm,
    editingId,
    saving,
    draggedId,
    setDraggedId,
    startEdit,
    cancelEdit,
    handleSubmit,
    handleDelete,
    handleDragOver,
    handleDrop,
    move,
  };
}
