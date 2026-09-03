import mongoose from "mongoose";

/**
 * Shared list/create/update/delete/reorder algorithm for every MongoDB-backed,
 * manually-orderable repository (BlogPost, GalleryPhoto, PortfolioProject).
 * Each concrete repository only differs in its Mongoose model, its entity
 * class, and its seed data — the actual queries live here once instead of
 * being copy-pasted per resource.
 */

export function toRecord(doc) {
  const obj = doc.toObject();
  return { ...obj, id: String(obj._id) };
}

export async function ensureSeededOrdered(Model, seed, EntityClass) {
  const count = await Model.countDocuments();
  if (count === 0) {
    // order = seed array index, so the initial listing matches the order
    // the records are authored in their seed file.
    await Model.insertMany(seed.map((raw, i) => ({ ...new EntityClass(raw), order: i })));
    return;
  }
  await backfillOrder(Model);
}

// Documents written before the `order` field existed have no value for it
// at all — a plain ascending sort would push all of them to the very front
// ahead of anything with a real order. Runs once at boot; assigns order by
// each unordered document's existing createdAt/_id position, so an upgrade
// doesn't silently reshuffle a deployment's existing records.
async function backfillOrder(Model) {
  const unordered = await Model.find({ order: { $exists: false } }).sort({ createdAt: 1, _id: 1 });
  if (!unordered.length) return;
  const highest = await Model.findOne({ order: { $exists: true } }).sort({ order: -1 });
  let next = typeof highest?.order === "number" ? highest.order + 1 : 0;
  await Model.bulkWrite(
    unordered.map((doc) => ({ updateOne: { filter: { _id: doc._id }, update: { order: next++ } } }))
  );
}

export async function listOrdered(Model) {
  // createdAt/_id remain as a tiebreaker for any rows that briefly share an
  // order value (e.g. mid-migration).
  const docs = await Model.find().sort({ order: 1, createdAt: 1, _id: 1 });
  return docs.map(toRecord);
}

// New records are appended to the end of the manual order, not spliced to
// the front — the admin dragged everything else into place on purpose.
export async function createOrdered(Model, entity) {
  const highest = await Model.findOne().sort({ order: -1 });
  const order = typeof highest?.order === "number" ? highest.order + 1 : 0;
  const doc = await Model.create({ ...entity, order });
  return toRecord(doc);
}

// `entity` is a freshly-constructed domain entity (used only to validate
// and normalize the incoming payload) — its own `createdAt` is deliberately
// dropped so an edit can never overwrite the record's original creation
// timestamp with "now".
export async function updateOrdered(Model, id, entity) {
  const { createdAt, ...data } = entity;
  try {
    const doc = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return doc ? toRecord(doc) : null;
  } catch (err) {
    // A malformed id (not a valid ObjectId) throws CastError before ever
    // reaching the database — treat it the same as "not found" rather than
    // a 500, matching what a real invalid id means to the caller.
    if (err.name === "CastError") return null;
    throw err;
  }
}

export async function deleteOrdered(Model, id) {
  const res = await Model.deleteOne({ _id: id });
  return res.deletedCount > 0;
}

export async function reorderOrdered(Model, orderedIds) {
  const ops = orderedIds
    .filter((id) => mongoose.isValidObjectId(id))
    .map((id, index) => ({ updateOne: { filter: { _id: id }, update: { order: index } } }));
  if (ops.length) await Model.bulkWrite(ops);
  return listOrdered(Model);
}
