import { DomainValidationError } from "../../../domain/entities/ContactMessage.js";

export function makeContactController({ submitContactMessage, listContactMessages }) {
  return {
    async create(req, res) {
      try {
        const saved = await submitContactMessage.execute(req.body || {});
        res.status(201).json({ success: true, data: saved });
      } catch (err) {
        if (err instanceof DomainValidationError) {
          return res.status(400).json({ success: false, message: err.message });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong." });
      }
    },
    async index(req, res) {
      const messages = await listContactMessages.execute();
      res.json(messages);
    },
  };
}
