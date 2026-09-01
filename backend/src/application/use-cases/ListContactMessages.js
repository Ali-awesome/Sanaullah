export class ListContactMessages {
  /** @param {import('../../domain/repositories/IContactRepository.js').IContactRepository} contactRepository */
  constructor(contactRepository) {
    this.contactRepository = contactRepository;
  }

  async execute() {
    return this.contactRepository.list();
  }
}
