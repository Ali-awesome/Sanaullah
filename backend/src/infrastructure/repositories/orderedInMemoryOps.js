/**
 * Shared list/create/update/delete/reorder algorithm for every in-memory,
 * manually-orderable repository (BlogPost, GalleryPhoto, PortfolioProject).
 * Each concrete repository only differs in its entity class, its own id
 * counter, and the array it stores records in — the actual logic lives
 * here once instead of being copy-pasted per resource.
 */

// Seed data is the only place these repositories construct an entity
// themselves — everywhere else (create/update), the use-case has already
// constructed and validated it, and the repository's job is only to store
// that entity, not re-validate it a second time.
export function seedOrdered(seed, EntityClass, nextId) {
  return seed.map((raw, i) => ({ id: String(nextId()), ...new EntityClass(raw), order: i }));
}

export function listOrdered(items) {
  return [...items].sort((a, b) => a.order - b.order);
}

// New records are appended to the end of the manual order, not spliced to
// the front — the admin dragged everything else into place on purpose.
export function createOrdered(items, nextId, entity) {
  const record = { id: String(nextId()), ...entity, order: items.length };
  items.push(record);
  return record;
}

// Keeps the original id, createdAt, and manual order — editing a record's
// content shouldn't change its identity or reshuffle its position.
export function updateOrdered(items, id, entity) {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  const record = { ...entity, id, createdAt: items[index].createdAt, order: items[index].order };
  items[index] = record;
  return record;
}

// Mutates `items` in place (splice) so callers don't need to reassign
// their own array reference after calling this.
export function deleteOrdered(items, id) {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

export function reorderOrdered(items, orderedIds) {
  orderedIds.forEach((id, index) => {
    const item = items.find((i) => i.id === id);
    if (item) item.order = index;
  });
  return listOrdered(items);
}
