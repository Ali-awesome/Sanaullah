import { IContactRepository } from "../../domain/repositories/IContactRepository.js";

let seq = 1;

/**
 * Adapter: fulfills IContactRepository with a process-memory array.
 * Used automatically when no MongoDB connection is available, so the
 * app runs with zero external setup. Messages are lost on restart —
 * that trade-off is called out in the README.
 *
 * Ordering uses an insertion sequence rather than `createdAt` alone:
 * two messages saved within the same millisecond would otherwise tie
 * and fall back to array order, silently breaking "newest first".
 */
export class InMemoryContactRepository extends IContactRepository {
  constructor() {
    super();
    this.messages = [];
  }

  async save(contactMessage) {
    const record = { ...contactMessage, _seq: seq++ };
    this.messages.push(record);
    return record;
  }

  async list() {
    return [...this.messages]
      .sort((a, b) => b._seq - a._seq)
      .map(({ _seq, ...rest }) => rest);
  }
}
