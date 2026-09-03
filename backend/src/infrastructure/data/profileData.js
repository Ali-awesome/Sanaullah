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
    "I build products where user needs, business strategy, and data come together. As a Product Manager with a Data Science background, I translate complex problems and insights into products that drive meaningful outcomes.",
  avatarImage: "/img/slider/1.jpg",
  location: "Dhaka, Bangladesh",
  email: "msanaullahali07@gmail.com",
  phone: "+8801676695828",
  linkedin: "https://www.linkedin.com/in/mohammad-sanaullah-rabby/",
  github: "https://github.com/ali-awesome",
  // Note: the CV itself is served from its own backend-managed store now
  // (see infrastructure/data/assets/default-cv.pdf + ICvRepository), not a
  // static path here, so an admin upload can actually replace it — see
  // DownloadCvButton on the frontend.

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

  // Note: "Publications & Learning" posts, Portfolio project cards, and
  // gallery photos all live in their own stores now (see
  // infrastructure/data/{blogSeed,portfolioSeed,gallerySeed}.js) so they can
  // be managed at runtime through the admin panel, instead of being baked
  // into this file.

  contactMapQuery: "Provati Uchya Biddyaniketon, 219 New Eskaton Road, Dhaka 1000, Bangladesh",
};
