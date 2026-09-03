/**
 * Initial Portfolio project cards, seeded into the PortfolioProject store on
 * first run. After that, projects are managed entirely through the
 * /api/portfolio-projects admin endpoints (see AdminPanel on the frontend) —
 * this file is not read again once the store has data.
 */
export const portfolioSeed = [
  {
    title: "Job Market Intelligence & Client Retention",
    category: "Data Analytics",
    date: "January 2026",
    client: "Bdjobs.com",
    image: "/img/portfolio/5.jpg",
    summary:
      "Analyzed 800,000+ job records, standardizing ~5,000 job titles into ~200 product-ready categories, and defined churn-risk insights for the Top 100 enterprise customers using 6 years of usage data.",
  },
  {
    title: "Best CV — Candidate Matching Product",
    category: "Product Management",
    date: "December 2025",
    client: "Bdjobs.com",
    image: "/img/portfolio/6.jpg",
    summary:
      "Led concept and development of a hiring-fulfillment solution matching high-fit candidates to low-response job ads. Authored the PRD, defined match-scoring logic, and drove execution with 2 developers and 1 designer.",
  },
  {
    title: "MatchKey CAPTCHA — Siamese Neural Network",
    category: "AI/ML",
    date: "February 2025",
    client: "IEEE Publication",
    image: "/img/portfolio/4.jpg",
    summary:
      "Co-authored an IEEE conference paper implementing a Siamese Neural Network for object-orientation estimation to solve MatchKey CAPTCHA, including dataset scraping, annotation, and model tuning.",
    link: "https://ieeexplore.ieee.org/document/11013318",
  },
  {
    title: "RSA Algorithm — A Comprehensive Study",
    category: "Research",
    date: "November 2021",
    client: "Academic Project",
    image: "/img/portfolio/3.jpg",
    summary:
      "Studied GCD, Fermat's Little Theorem, and the Euclidean Algorithm behind RSA, and how mobile banking applies cryptography to secure transactions.",
  },
];
