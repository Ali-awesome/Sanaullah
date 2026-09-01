/**
 * Initial "Publications & Learning" posts, seeded into the BlogPost store
 * on first run. After that, posts are managed entirely through the
 * /api/posts admin endpoints (see AdminPanel on the frontend) — this file
 * is not read again once the store has data.
 */
export const blogSeed = [
  {
    title:
      "A deep-learning-based approach for object orientation estimation to solve MatchKey CAPTCHA using a Siamese Neural Network",
    source: "IEEE Conference Publication",
    date: "February 2025",
    image: "/img/news/1.jpg",
    summary:
      "Implemented a Siamese Neural Network for object orientation estimation to solve MatchKey CAPTCHA, including dataset scraping, annotation, and model optimization.",
    link: "https://ieeexplore.ieee.org/document/11013318",
  },
  {
    title: "Advanced Product Management: Vision, Strategy, and Metrics",
    source: "Udemy — Course",
    date: "",
    image: "/img/news/2.jpg",
    summary: "Completed coursework on product vision, strategy design, and metrics-driven roadmap planning.",
  },
  {
    title: "Machine Learning Specialization",
    source: "Coursera — by Andrew Ng",
    date: "",
    image: "/img/news/3.jpg",
    summary: "Completed the foundational specialization covering supervised/unsupervised learning and best practices.",
  },
];
