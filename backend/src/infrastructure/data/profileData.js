/**
 * Static seed content for the portfolio, sourced from
 * Mohammad Sanaullah's resume. This is the one "repository" swap point:
 * replace StaticProfileRepository with a DB-backed one without touching
 * the application or interface layers.
 */
export const profileData = {
  name: "Mohammad Sanaullah",
  title: "Product Analyst",
  tagline:
    "I turn business needs into data-driven product decisions, blending Agile product analysis with hands-on MERN/Django and ML engineering.",
  avatarImage: "/img/slider/1.jpg",
  location: "Dhaka, Bangladesh",
  email: "msanaullahali07@gmail.com",
  phone: "+8801676695828",
  linkedin: "https://www.linkedin.com/in/mohammad-sanaullah-rabby/",
  github: "https://github.com/ali-awesome",
  cvUrl: "/cv/Mohammad_Sanaullah_CV.pdf",

  about: {
    heading: "About Me",
    role: "Product Analyst",
    paragraphs: [
      "Product Analyst with over a year of experience translating business needs into data-driven product decisions at Bdjobs.com. Experienced in Agile delivery, product analytics, and cross-functional collaboration to improve user experience and business outcomes.",
      "Passionate about solving complex business problems through structured analysis, stakeholder collaboration, and continuous product improvement — with a background in Applied Mathematics and a Master's in Data Science that shapes how I approach every problem.",
    ],
    info: {
      left: [
        { label: "Location", value: "Dhaka, Bangladesh" },
        { label: "Email", value: "msanaullahali07@gmail.com", href: "mailto:msanaullahali07@gmail.com" },
        { label: "Phone", value: "+8801676695828", href: "tel:+8801676695828" },
      ],
      right: [
        { label: "Nationality", value: "Bangladeshi" },
        { label: "Study", value: "Jahangirnagar University" },
        { label: "Degree", value: "M.Sc. in Data Science and Applied Statistics" },
        { label: "Status", value: "Open to opportunities" },
      ],
    },
  },

  technicalSkills: [
    { label: "SQL", value: 90 },
    { label: "Python", value: 85 },
    { label: "Power BI", value: 90 },
  ],
  languageSkills: [
    { label: "Bengali (Native)", value: 100 },
    { label: "English (IELTS 8)", value: 90 },
  ],

  knowledge: [
    "Business Strategy & Strategic Planning",
    "Product Analytics & KPI Tracking",
    "Agile Delivery, Scrum, Backlog Management",
    "PRD / BRD Documentation & UAT",
    "Stakeholder & Cross-Functional Collaboration",
    "SQL, Python, Pandas, NumPy, Power BI",
  ],
  interests: ["Reading", "Coding", "Debate", "Sports", "Data Analysis", "User Interface"],

  education: [
    {
      period: "2022 - 2024",
      place: "Jahangirnagar University",
      degree: "M.Sc. in Data Science and Applied Statistics",
    },
    {
      period: "2016 - 2022",
      place: "Noakhali Science and Technology University",
      degree: "B.Sc. in Applied Mathematics",
    },
  ],
  experience: [
    { period: "07/2025 - Present", place: "Bdjobs.com", role: "Product Analyst" },
    { period: "02/2021 - 04/2022", place: "YEF Global", role: "Campus Ambassador" },
    { period: "07/2019 - 04/2022", place: "NSTU Math Club", role: "Founding Secretary" },
  ],

  // Real impact metrics from the resume, replacing the template's generic "fun facts".
  impactStats: [
    { value: "800K+", label: "Job Records Refined" },
    { value: "5,000 -> 200", label: "Job Titles Standardized into Categories" },
    { value: "15%", label: "Feature Adoption Increase" },
  ],

  services: [
    {
      number: "01",
      title: "Product Analytics",
      text: "Turning product usage data into KPIs, funnels, cohorts, and A/B test results that drive decisions.",
      details:
        "I design and monitor product KPIs end to end — from Power BI dashboards to funnel, cohort, and A/B test analysis — so stakeholders can act on evidence instead of guesses. At Bdjobs.com this work fed a 15% increase in feature adoption, an 18% reduction in user drop-off, and a 10% improvement in retention.",
    },
    {
      number: "02",
      title: "Requirements & Documentation",
      text: "Gathering business requirements and translating them into clear PRDs, BRDs, and measurable KPIs.",
      details:
        "I work closely with business stakeholders and engineering teams to capture requirements accurately, document them as PRDs/BRDs, and define measurable success criteria before a single line of code is written.",
    },
    {
      number: "03",
      title: "Agile Delivery",
      text: "Coordinating backlog refinement, sprint planning, and execution to ship on time.",
      details:
        "I run and support Agile ceremonies — backlog refinement, sprint planning, task prioritization — and coordinate cross-functional teams through UAT and release, keeping ownership and timelines clear.",
    },
    {
      number: "04",
      title: "Data Engineering & Analysis",
      text: "Using SQL, Python, and Excel to clean, standardize, and analyze large datasets.",
      details:
        "I've standardized 800,000+ job and application records, reducing roughly 5,000 raw job titles to about 200 product-ready categories, and analyzed six years of customer data for top enterprise clients.",
    },
    {
      number: "05",
      title: "Web Development (MERN)",
      text: "Building full-stack apps with React, Node/Express, and MongoDB.",
      details:
        "Hands-on experience building and shipping full-stack JavaScript applications, applying the same structured, requirements-first thinking I use in product work to the code itself.",
    },
    {
      number: "06",
      title: "Machine Learning & AI",
      text: "Applying ML techniques to real problems, from CAPTCHA-solving research to recommendation logic.",
      details:
        "Co-authored an IEEE publication on a Siamese Neural Network for CAPTCHA object-orientation estimation, and translated job-title clustering into candidate-matching and recommendation use cases at Bdjobs.com.",
    },
  ],

  // Real projects from the resume, in place of the template's stock portfolio items.
  portfolio: [
    {
      slug: "job-market-intelligence",
      title: "Job Market Intelligence & Client Retention",
      category: "Data Analytics",
      date: "January 2026",
      client: "Bdjobs.com",
      image: "/img/portfolio/5.jpg",
      summary:
        "Analyzed 800,000+ job records, standardizing ~5,000 job titles into ~200 product-ready categories, and defined churn-risk insights for the Top 100 enterprise customers using 6 years of usage data.",
    },
    {
      slug: "best-cv",
      title: "Best CV — Candidate Matching Product",
      category: "Product Management",
      date: "December 2025",
      client: "Bdjobs.com",
      image: "/img/portfolio/6.jpg",
      summary:
        "Led concept and development of a hiring-fulfillment solution matching high-fit candidates to low-response job ads. Authored the PRD, defined match-scoring logic, and drove execution with 2 developers and 1 designer.",
    },
    {
      slug: "matchkey-captcha",
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
      slug: "rsa-cryptography",
      title: "RSA Algorithm — A Comprehensive Study",
      category: "Research",
      date: "November 2021",
      client: "Academic Project",
      image: "/img/portfolio/3.jpg",
      summary:
        "Studied GCD, Fermat's Little Theorem, and the Euclidean Algorithm behind RSA, and how mobile banking applies cryptography to secure transactions.",
    },
  ],

  // Note: "Publications & Learning" posts now live in their own BlogPost
  // store (see infrastructure/data/blogSeed.js) so new posts can be added
  // at runtime through /api/posts, instead of being baked into this file.

  contactMapQuery: "Provati Uchya Biddyaniketon, 219 New Eskaton Road, Dhaka 1000, Bangladesh",
};
