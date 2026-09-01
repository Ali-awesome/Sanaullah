import mongoose from "mongoose";

/**
 * Tries to connect to MongoDB. Returns true on success, false otherwise.
 * The caller decides which contact repository to use based on this.
 */
export async function tryConnectMongo(uri) {
  if (!uri) return false;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("[db] Connected to MongoDB");
    return true;
  } catch (err) {
    console.warn(`[db] MongoDB unavailable (${err.message}). Falling back to in-memory contact storage.`);
    return false;
  }
}
