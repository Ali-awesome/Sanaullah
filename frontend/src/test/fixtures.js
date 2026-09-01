export const samplePortfolio = [
  {
    slug: "a",
    title: "Project A",
    category: "Data Analytics",
    date: "2026",
    client: "Client A",
    image: "/img/portfolio/1.jpg",
    summary: "Summary A.",
  },
  {
    slug: "b",
    title: "Project B",
    category: "Machine Learning",
    date: "2026",
    client: "Client B",
    image: "/img/portfolio/2.jpg",
    summary: "Summary B.",
  },
];

export const sampleGallery = [
  { id: "g1", name: "Gallery Photo One", image: "/img/portfolio/1.jpg" },
  { id: "g2", name: "Gallery Photo Two", image: "/img/portfolio/2.jpg" },
];

export const samplePosts = [
  { id: "1", title: "First Post", source: "Blog", date: "2026", summary: "Summary one.", image: "/img/news/1.jpg" },
  { id: "2", title: "Second Post", source: "Blog", date: "2026", summary: "Summary two.", image: "/img/news/2.jpg" },
];

// Minimal identity-only fields — enough for Home and Contact, but NOT a
// complete profile (About/Service would crash on the fields below).
// Isolated component tests that only render Home/Contact/Portfolio should
// use this directly, or spread it with the extra fields they need.
export const sampleProfile = {
  name: "Test Person",
  title: "Product Analyst",
  tagline: "Test tagline.",
  avatarImage: "/img/slider/1.jpg",
  location: "Dhaka, Bangladesh",
  email: "test@example.com",
  phone: "+8801000000000",
  linkedin: "https://linkedin.com/in/test",
  github: "https://github.com/test",
  cvUrl: "/cv/test.pdf",
  contactMapQuery: "Dhaka, Bangladesh",
};

// A profile with every field every section reads — for tests (like
// App.test.jsx) that render the whole page, where every section mounts
// simultaneously regardless of which one is visually active.
export const fullSampleProfile = {
  ...sampleProfile,
  about: {
    heading: "About Me",
    role: "Product Analyst",
    paragraphs: ["Paragraph one.", "Paragraph two."],
    info: {
      left: [{ label: "Location", value: "Dhaka" }],
      right: [{ label: "Status", value: "Available" }],
    },
  },
  technicalSkills: [{ label: "SQL", value: 90 }],
  languageSkills: [{ label: "English", value: 90 }],
  knowledge: ["Testing"],
  interests: ["Reading"],
  education: [{ period: "2020", place: "Test University", degree: "B.Sc." }],
  experience: [{ period: "2024", place: "Test Co.", role: "Analyst" }],
  impactStats: [{ value: "10", label: "Things Tested" }],
  services: [{ number: "01", title: "Testing", text: "Short text.", details: "Full details." }],
  portfolio: samplePortfolio,
};
