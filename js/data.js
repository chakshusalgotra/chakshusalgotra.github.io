/**
 * data.js — Single source of truth for the portfolio.
 * ----------------------------------------------------
 * Two top-level objects:
 *   RESUME  → everything parsed from resume.pdf
 *   GITHUB  → a static snapshot of the GitHub public API (fetched 2026-06-23)
 *
 * To update the site, edit the values below. Nothing else needs to change.
 */

/* eslint-disable */
const RESUME = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: "Chakshu Salgotra",
  initials: "CS",
  title: "Data Engineer",
  // Titles cycled by the hero typewriter.
  roles: ["Data Engineer", "ETL/ELT Architect", "Cloud Data Specialist"],
  location: "Jammu, J&K, India",
  email: "chakshusalgotra@gmail.com",
  phone: "+91 78895 81376",
  phoneHref: "+917889581376",
  availability: "Open to opportunities",
  resumeFile: "resume.pdf",

  // ── Links ─────────────────────────────────────────────────────────────────
  links: {
    github: "https://github.com/chakshusalgotra",
    linkedin: "https://www.linkedin.com/in/chakshu-salgotra/",
    leetcode: "https://leetcode.com/u/chakshu21/",
    medium: "https://medium.com/@chakshu-salgotra",
    website: null,
    twitter: null,
  },

  // ── Bio ───────────────────────────────────────────────────────────────────
  tagline:
    "I architect scalable ETL/ELT pipelines and cloud data platforms that turn raw data into reliable, analysis-ready products.",
  summary:
    "Data Engineer with 5 years of experience architecting scalable ETL/ELT pipelines and cloud infrastructure across Azure, AWS, and Databricks. Proven ability to deliver high-quality, reliable data for advanced analytics and machine learning while aligning technical solutions with cross-functional revenue operations.",
  about: [
    "I'm a Data Engineer with five years of experience building the data platforms that power analytics, machine learning, and revenue operations. My work centers on designing ETL/ELT pipelines that stay reliable at scale — from ingestion and orchestration to governance and delivery.",
    "I've worked across the modern data stack on Azure, AWS, and Databricks: building Medallion architectures, optimizing Airflow and PySpark workloads, and driving cloud migrations that cut both runtime and cost. I care deeply about data integrity, observability, and the operational health of the systems I ship.",
    "Whether I'm slashing pipeline runtimes by 75%, reducing compute spend by 20%, or delivering audience data across 45+ markets, I focus on outcomes that cross-functional teams can build on with confidence.",
  ],

  // Four key strengths shown in the About → "What I bring" list.
  strengths: [
    {
      icon: "pipeline",
      title: "Scalable Pipeline Architecture",
      text: "ETL/ELT systems built on Python, SQL & PySpark that stay reliable at enterprise scale.",
    },
    {
      icon: "cloud",
      title: "Cloud Cost Optimization",
      text: "Cut Databricks compute spend 20% and pipeline runtimes up to 75% through refactoring & sizing.",
    },
    {
      icon: "shield",
      title: "Data Governance",
      text: "Medallion (Bronze/Silver/Gold) architectures with validation, anomaly detection & compliance.",
    },
    {
      icon: "users",
      title: "Cross-Functional Delivery",
      text: "Analysis-ready data delivered to marketing science, analytics & ML teams across 45+ markets.",
    },
  ],

  // ── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      company: "Omnicom",
      role: "Data Engineer",
      type: "Full-time",
      start: "2025-04",
      end: null, // null === Present
      location: "Remote",
      current: true,
      url: "https://www.omnicomgroup.com/",
      bullets: [
        "Architected and maintained scalable ETL/ELT data pipelines using Python, SQL, and PySpark, ensuring data integrity and streamlined cross-functional data delivery for advanced analytics.",
        "Spearheaded cost-effective cloud migration initiatives, transferring data ingestion jobs to AWS Glue and orchestrating them via Airflow to optimize pipeline performance, cost, and reliability.",
        "Implemented Medallion Architecture (Bronze, Silver, Gold) across data lakes to establish robust data governance, security, and compliance while serving high-quality datasets downstream.",
        "Nissan Data Platform — Optimized legacy Airflow ETL pipelines, slashing runtime by 75% (80→20 min) via codebase refactoring, and designed an end-to-end Medallion pipeline for YouGov data.",
        "Agile Release Delivery (ARD) — Built pipelines ingesting comScore & Lotame audience data across 45+ markets, plus an Airflow health-check framework with automated Teams alerts on failures.",
      ],
      stack: ["Python", "SQL", "PySpark", "AWS Glue", "Airflow", "Airbyte", "Delta Lake"],
    },
    {
      company: "Zebra Technologies",
      role: "Data Engineer",
      type: "Full-time",
      start: "2021-06",
      end: "2025-04",
      location: "India",
      current: false,
      url: "https://www.zebra.com/",
      bullets: [
        "Designed and maintained scalable data pipelines on Azure, integrating REST APIs and real-time sources to prepare structured big data for analytics and machine learning workflows.",
        "Leveraged Databricks Workspace, Databricks SQL, and Delta Lake for large-scale distributed processing with PySpark, reducing processing time by 15%.",
        "Automated ETL workflows with Airflow and Azure Databricks, improving operational efficiency by 18% and establishing MLOps and cloud-deployment best practices.",
        "DataOps Utilities — Cut Databricks compute costs 20% with a REST API utility tracking per-job runtime and usage across 15+ client workspaces.",
        "IOSM — Built an SFTP monitoring tool with 6-hour SLA early-warnings, reducing manual monitoring effort by 80%; co-led Bimbo Bakeries' AWS→Azure DLT migration with SCD Type 2 logic.",
        "GlaxoSmithKline (GSK) — Architected pricing engines analyzing 50+ markets, designing pricing strategies worth $100M+ in annual revenue with 92% predictive accuracy.",
      ],
      stack: ["Azure", "Databricks", "Delta Lake", "PySpark", "Airflow", "PostgreSQL", "AWS S3"],
    },
  ],

  // ── Skills (grouped) ──────────────────────────────────────────────────────
  // category keys map to the filter tabs; `icon` is a devicon class (or null → letter fallback)
  skills: [
    // Languages
    { name: "Python", category: "Languages", level: "Expert", icon: "devicon-python-plain colored" },
    { name: "SQL", category: "Languages", level: "Expert", icon: "devicon-azuresqldatabase-plain colored" },
    { name: "PySpark", category: "Languages", level: "Expert", icon: "devicon-apachespark-original colored" },
    { name: "Pandas", category: "Languages", level: "Advanced", icon: "devicon-pandas-original colored" },
    { name: "NumPy", category: "Languages", level: "Advanced", icon: "devicon-numpy-original colored" },
    { name: "Bash", category: "Languages", level: "Advanced", icon: "devicon-bash-plain colored" },

    // Databases
    { name: "PostgreSQL", category: "Databases", level: "Expert", icon: "devicon-postgresql-plain colored" },
    { name: "MySQL", category: "Databases", level: "Advanced", icon: "devicon-mysql-plain colored" },
    { name: "Amazon RDS", category: "Databases", level: "Advanced", icon: "devicon-amazonwebservices-plain-wordmark colored" },
    { name: "BigQuery", category: "Databases", level: "Intermediate", icon: "devicon-googlecloud-plain colored" },
    { name: "SingleStore", category: "Databases", level: "Intermediate", icon: null },
    { name: "AWS Athena", category: "Databases", level: "Advanced", icon: null },
    { name: "Starburst", category: "Databases", level: "Intermediate", icon: null },

    // Frameworks (orchestration & processing)
    { name: "Apache Airflow", category: "Frameworks", level: "Expert", icon: "devicon-apacheairflow-plain colored" },
    { name: "Databricks", category: "Frameworks", level: "Expert", icon: "devicon-databricks-plain colored" },
    { name: "Delta Lake", category: "Frameworks", level: "Advanced", icon: null },
    { name: "dbt", category: "Frameworks", level: "Advanced", icon: null },
    { name: "Airbyte", category: "Frameworks", level: "Advanced", icon: null },
    { name: "MWAA", category: "Frameworks", level: "Advanced", icon: null },

    // DevOps & Cloud
    { name: "AWS", category: "DevOps", level: "Expert", icon: "devicon-amazonwebservices-plain-wordmark colored" },
    { name: "Azure", category: "DevOps", level: "Expert", icon: "devicon-azure-plain colored" },
    { name: "AWS Glue", category: "DevOps", level: "Advanced", icon: null },
    { name: "AWS S3", category: "DevOps", level: "Expert", icon: null },
    { name: "GCP Compute", category: "DevOps", level: "Intermediate", icon: "devicon-googlecloud-plain colored" },
    { name: "Docker", category: "DevOps", level: "Advanced", icon: "devicon-docker-plain colored" },
    { name: "CI/CD", category: "DevOps", level: "Advanced", icon: null },
    { name: "GitHub Actions", category: "DevOps", level: "Advanced", icon: "devicon-githubactions-plain colored" },

    // Tools & Analytics
    { name: "REST APIs", category: "Tools", level: "Expert", icon: null },
    { name: "Jupyter", category: "Tools", level: "Advanced", icon: "devicon-jupyter-plain colored" },
    { name: "Tableau", category: "Tools", level: "Advanced", icon: "devicon-tableau-plain colored" },
    { name: "Apache Superset", category: "Tools", level: "Intermediate", icon: null },
    { name: "Grafana", category: "Tools", level: "Advanced", icon: "devicon-grafana-original colored" },
    { name: "Data Modeling", category: "Tools", level: "Expert", icon: null },
  ],

  // Order of the skills filter tabs.
  skillCategories: ["All", "Languages", "Frameworks", "Databases", "DevOps", "Tools"],

  // Soft skills inferred from experience (shown as chips in About).
  softSkills: [
    "Cross-Functional Collaboration",
    "Technical Leadership",
    "Stakeholder Communication",
    "Cost Optimization",
    "Problem Solving",
    "Mentorship",
  ],

  // ── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      institution: "Chandigarh University",
      degree: "Bachelor of Engineering",
      field: "Computer Science",
      location: "Punjab, India",
      start: "2017-06",
      end: "2021-06",
      gpa: null,
      type: "engineering",
    },
  ],

  // No certifications on the resume — the right column shows real achievements instead.
  certifications: [],

  // ── Key achievements (real metrics) — used in place of empty certifications ─
  achievements: [
    { metric: "$100M+", label: "Pricing strategy revenue", detail: "GSK engines across 50+ markets at 92% accuracy" },
    { metric: "75%", label: "Pipeline runtime reduction", detail: "Nissan Airflow ETL: 80 → 20 minutes" },
    { metric: "20%", label: "Databricks cost reduction", detail: "DataOps utility across 15+ client workspaces" },
    { metric: "80%", label: "Less manual monitoring", detail: "IOSM SFTP tool with 6-hour SLA warnings" },
    { metric: "45+", label: "Markets served", detail: "comScore & Lotame audience data delivery" },
  ],
};

const GITHUB = {
  username: "chakshusalgotra",
  name: "Chakshu Salgotra",
  bio: "Computer Engineer | Flutter Developer | Dart | C++ | Python",
  avatar: "https://avatars.githubusercontent.com/u/44551619",
  profileUrl: "https://github.com/chakshusalgotra",
  followers: 0,
  following: 3,
  publicRepos: 24,
  totalStars: 1,
  primaryLanguage: "Python",
  fetchedAt: "2026-06-23",

  // Curated repo metadata used to enrich live GitHub API results by repo name.
  repos: [
    {
      name: "my-macros",
      description: "Nutrition tracking app with OCR, barcode scanning, and deep micronutrient tracking.",
      summary:
        "A cross-platform Flutter nutrition tracker featuring OCR label scanning, barcode lookup, and deep micronutrient analysis. It helps users log meals and monitor calories and macros with detailed nutritional breakdowns.",
      url: "https://github.com/chakshusalgotra/my-macros",
      homepage: null,
      language: "Dart",
      stars: 1,
      forks: 0,
      openIssues: 0,
      pushedAt: "2026-02-03",
      topics: ["flutter", "nutrition", "ocr", "health"],
      languages: { Dart: 1092550, "C++": 26897, CMake: 19981, Swift: 3658, Kotlin: 1716, C: 1488, HTML: 1229, "Objective-C": 38 },
      featured: true,
    },
    {
      name: "neetcode-submissions",
      description: "My NeetCode.io problem submissions.",
      summary:
        "An auto-synced collection of accepted NeetCode.io interview solutions written in Python. It documents consistent data-structures-and-algorithms practice across curated coding-interview problems.",
      url: "https://github.com/chakshusalgotra/neetcode-submissions",
      homepage: null,
      language: "Python",
      stars: 0,
      forks: 0,
      openIssues: 0,
      pushedAt: "2026-06-23",
      topics: ["python", "algorithms", "leetcode", "dsa"],
      languages: { Python: 22195 },
      featured: false,
    },
    {
      name: "MWAA_cursor",
      description: "MWAA environment with Airbyte and LocalStack integration.",
      summary:
        "A local MWAA-style Apache Airflow environment integrated with Airbyte and LocalStack to emulate AWS services. It lets you develop and test data-integration pipelines locally with Docker, Postgres, and S3 emulation.",
      url: "https://github.com/chakshusalgotra/MWAA_cursor",
      homepage: null,
      language: "Shell",
      stars: 0,
      forks: 0,
      openIssues: 0,
      pushedAt: "2025-05-07",
      topics: ["airflow", "airbyte", "localstack", "data-engineering"],
      languages: { Shell: 477 },
      featured: false,
    },
    {
      name: "chakshuDeZoomcamp",
      description: "Data Engineering Zoomcamp coursework and exercises.",
      summary:
        "Hands-on exercises from the Data Engineering Zoomcamp covering Dockerized Postgres, pgAdmin, and the modern data stack. It documents the setup and workflows behind building batch and streaming data pipelines.",
      url: "https://github.com/chakshusalgotra/chakshuDeZoomcamp",
      homepage: null,
      language: "Jupyter Notebook",
      stars: 0,
      forks: 0,
      openIssues: 0,
      pushedAt: "2024-11-12",
      topics: ["data-engineering", "docker", "postgres", "zoomcamp"],
      languages: { "Jupyter Notebook": 144 },
      featured: false,
    },
    {
      name: "doc-summerizer",
      description: "Document buddy — a document summarization helper.",
      summary:
        "A lightweight document-summarization helper for condensing and extracting key points from text documents. An early-stage utility focused on quick document understanding.",
      url: "https://github.com/chakshusalgotra/doc-summerizer",
      homepage: null,
      language: "Python",
      stars: 0,
      forks: 0,
      openIssues: 0,
      pushedAt: "2026-06-06",
      topics: ["nlp", "summarization", "documents"],
      languages: {},
      featured: false,
    },
    {
      name: "image_sorter",
      description: "Utility for organizing and sorting image files.",
      summary:
        "A utility for organizing and sorting image files into structured folders. A lightweight automation script for tidying large image collections.",
      url: "https://github.com/chakshusalgotra/image_sorter",
      homepage: null,
      language: "Python",
      stars: 0,
      forks: 0,
      openIssues: 0,
      pushedAt: "2025-03-27",
      topics: ["python", "automation", "images"],
      languages: {},
      featured: false,
    },
    {
      name: "Bmi-Calculator",
      description: "Multi-screen BMI calculator built with Flutter.",
      summary:
        "A multi-screen BMI (Body Mass Index) calculator built with Flutter, featuring custom theming, routing, and reusable widgets. A polished UI exercise showcasing Flutter navigation and component design.",
      url: "https://github.com/chakshusalgotra/Bmi-Calculator",
      homepage: null,
      language: "Dart",
      stars: 0,
      forks: 0,
      openIssues: 0,
      pushedAt: "2020-10-02",
      topics: ["flutter", "dart", "mobile"],
      languages: { Dart: 14672, "Objective-C": 1314, Java: 931, Shell: 697 },
      featured: false,
    },
    {
      name: "neuralnest.co.in",
      description: "NeuralNest platform codebase with backend services and data workflows.",
      summary:
        "neuralnest.co.in is a one data first platform, to practice advanced sql, pandas, spark, python problems, and have knowledge base to learn about data tools  and tech stack. Recently integrated Neural bot provides you hints to the problem  on how to approch the problem and also if you feel to review your code it can rate and prove you  with other or  better approch to the problem.",
      url: "https://github.com/chakshusalgotra/neuralnest.co.in",
      homepage: "https://neuralnest.co.in",
      language: "Python",
      stars: 1,
      forks: 0,
      openIssues: 0,
      pushedAt: "2026-06-09",
      topics: ["python", "backend", "web-app"],
      languages: { Python: 1 },
      featured: false,
    },
    {
      name: "Twin-Dice-Roll",
      description: "A simple twin-dice rolling project demonstrating random simulation logic.",
      summary:
        "A lightweight code exercise that simulates two-dice rolls, useful for basic randomness, control-flow, and beginner-friendly game logic practice.",
      url: "https://github.com/chakshusalgotra/Twin-Dice-Roll",
      homepage: null,
      language: "Other",
      stars: 0,
      forks: 0,
      openIssues: 0,
      pushedAt: "2020-08-23",
      topics: ["dice", "simulation", "practice"],
      languages: {},
      featured: false,
    },
  ],
};

// GitHub linguist colors for language bars/badges.
const LANGUAGE_COLORS = {
  Dart: "#00B4AB",
  "C++": "#f34b7d",
  CMake: "#DA3434",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  C: "#555555",
  HTML: "#e34c26",
  "Objective-C": "#438eff",
  Python: "#3572A5",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  Java: "#b07219",
  Other: "#8b949e",
};

// Category accent colors for skill cards.
const CATEGORY_COLORS = {
  Languages: "#E0A82E",
  Frameworks: "#5AAB7E",
  Databases: "#C98A4E",
  DevOps: "#8FB339",
  Tools: "#E0859A",
};

// Writing — Medium profile + posts (snapshot fetched 2026-06-23 from the RSS feed).
const BLOG = {
  profileUrl: "https://medium.com/@chakshu-salgotra",
  posts: [
    {
      title: "When Your Data Pipeline Meets AI: A Love Story (That Actually Works)",
      url: "https://chakshu-salgotra.medium.com/when-your-data-pipeline-meets-ai-a-love-story-that-actually-works-00249b41f404",
      date: "2025-11-07",
      summary:
        "How AI went from buzzword to your new coworker who never complains about ETL jobs — a practical tour of where AI actually helps across the modern data stack, from code scaffolding and streaming to automated data quality.",
      tags: ["data-engineering", "ai", "etl", "kafka", "gen-ai"],
    },
  ],
};

// Live GitHub fetch configuration (see js/github.js).
//  - liveFetch: pull repos from the GitHub API at runtime so new repos auto-appear.
//  - includeForks: set true to also show forked repos.
//  - maxRepos: 0 = show all; otherwise cap the number of repos shown.
//  - cacheMinutes: how long to reuse a fetched result (per browser session).
const GITHUB_CONFIG = {
  username: "chakshusalgotra",
  liveFetch: true,
  includeForks: false,
  maxRepos: 0,
  cacheMinutes: 30,
  featuredRepo: "my-macros",
};

// Contact form delivery.
//  - endpoint: paste a Formspree (https://formspree.io/f/xxxxxxx) or Getform URL to
//    receive messages straight in your inbox (no email client needed).
//  - Leave endpoint "" to fall back to opening the visitor's mail app via mailto:.
const CONTACT = {
  endpoint: "https://formspree.io/f/mbdvdjnl ",
};

window.PORTFOLIO_DATA = { RESUME, GITHUB, GITHUB_CONFIG, CONTACT, LANGUAGE_COLORS, CATEGORY_COLORS, BLOG };
