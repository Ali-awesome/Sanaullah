/**
 * Initial gallery photos, seeded into the GalleryPhoto store on first run
 * (reusing the same project images already shipped in the Portfolio
 * section, so the "All" tab isn't empty on a fresh install). After that,
 * photos are managed entirely through the /api/gallery admin endpoints —
 * this file is not read again once the store has data.
 */
export const gallerySeed = [
  { name: "Job Market Intelligence & Client Retention", image: "/img/portfolio/5.jpg" },
  { name: "Best CV — Candidate Matching Product", image: "/img/portfolio/6.jpg" },
  { name: "MatchKey CAPTCHA — Siamese Neural Network", image: "/img/portfolio/4.jpg" },
  { name: "RSA Algorithm — A Comprehensive Study", image: "/img/portfolio/3.jpg" },
];
