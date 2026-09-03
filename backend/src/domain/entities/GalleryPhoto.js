import { DomainValidationError } from "./ContactMessage.js";

/**
 * Domain entity: GalleryPhoto (shown under the Portfolio section's "All"
 * tab, which is a photo gallery rather than a filtered list of project
 * cards). Self-validates on construction so an invalid photo can never be
 * stored.
 */
export class GalleryPhoto {
  constructor({ name, image, description }) {
    const cleanName = (name || "").trim();
    const cleanImage = (image || "").trim();

    if (!cleanName) throw new DomainValidationError("Name is required.");
    if (!cleanImage) throw new DomainValidationError("Image is required.");

    this.name = cleanName;
    this.image = cleanImage;
    // Optional — shown in the lightbox when a visitor clicks the photo;
    // not every photo needs one.
    this.description = (description || "").trim();
    this.createdAt = new Date();
  }
}
