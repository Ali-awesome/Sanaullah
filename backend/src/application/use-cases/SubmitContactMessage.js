import { ContactMessage } from "../../domain/entities/ContactMessage.js";

/**
 * Use case: submit a contact form message.
 * Builds the domain entity (which self-validates) then persists it
 * through the IContactRepository port.
 */
export class SubmitContactMessage {
  /** @param {import('../../domain/repositories/IContactRepository.js').IContactRepository} contactRepository */
  constructor(contactRepository) {
    this.contactRepository = contactRepository;
  }

  async execute(payload) {
    const message = new ContactMessage(payload);
    await this.contactRepository.save(message);
    return message;
  }
}
