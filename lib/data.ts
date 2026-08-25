// lib/data.ts — Single source of truth for all portfolio content

export const personalInfo = {
  name: "Gopikrishna Nallagorla",
  shortName: "GK",
  title: "Data Scientist",
  tagline: "Transforming Satellite Intelligence into Real-World Decisions",
  subTagline:
    "Agricultural Scientist · Remote Sensing Expert · Production ML Engineer",
  /** One-line opening statement, set apart from the body copy. */
  summaryLede:
    "Agriculture was my first degree, not a domain I picked up afterwards. That single fact shapes everything I build.",

  /** Rendered by the About section. `**text**` becomes an emphasis span. */
  summaryParagraphs: [
    "A B.Sc. in Agriculture came first, then an M.Sc. in Data Analytics, then several years building production systems. Most people in satellite agriculture arrive from one side or the other — strong on the data and reliant on someone else for the agronomy, or the reverse. Coming through both means I can hold the whole problem at once, and I rarely need a translator in the room.",
    "In practice that shows up in judgement. Knowing whether a change in a field points to a water problem or a nutrient one. Knowing whether something spotted this week can still be fixed, or whether the yield is already decided. That is the difference between a chart and a decision somebody can act on.",
    "I joined **Elai AgriTech** as a core founding team member and built its remote sensing and AI capability from nothing — models, services, and the interface the output arrives in. Alongside that I have designed and shipped two full platforms on my own, which is where I learned the most: when you own every layer, there is nowhere to hide a shortcut.",
    "What I care about most is that these systems are honest about what they know. A number that ends up in a loan file or a carbon claim is one somebody has to stand behind later — so mine carry their confidence with them, and say plainly when the satellite could not see enough to tell.",
  ],

  /** How the work is characterised, shown as compact pillars. */
  signatureThemes: [
    {
      title: "All-weather monitoring",
      body: "Several kinds of satellite and weather data combined, so monitoring keeps running through the monsoon instead of going dark.",
    },
    {
      title: "Built on agricultural science",
      body: "Grounded in established crop science rather than tuned to one region, so a field it has never seen still gets a sound answer.",
    },
    {
      title: "Confidence you can see",
      body: "Every result carries how certain it is — and the system will say it cannot tell, rather than guess.",
    },
    {
      title: "Built end to end",
      body: "From the model through to the alert a farmer or credit officer actually reads — designed and delivered start to finish.",
    },
  ],

  northStar:
    "Bridge the gap between satellite data and real-world decisions — for farmers who need to know if their crops are healthy, for carbon projects that need to prove their impact, and for banks that want to lend to smallholder farmers without ever visiting a field.",
  currentRole: "Data Scientist at Elai AgriTech, Pune",
  currentRoleNote:
    "Core founding team member who built the company's entire remote sensing and ML capability from zero.",
  openTo: [
    "Senior Data Science / ML roles",
    "Freelance & contract project development",
    "Consulting in AgriTech & Climate-Tech",
    "Startup / VC technical collaboration",
    "Strategic ESG & carbon intelligence partnerships",
    "Research & academic collaboration",
  ],

  email: "gopik8023@gmail.com",
  phone: "+91 9676246407",
  linkedin: "linkedin.com/in/gopikrishna-nallagorla-datascientist",
  linkedinUrl: "https://linkedin.com/in/gopikrishna-nallagorla-datascientist",
  github: "github.com/Krish9676",
  githubUrl: "https://github.com/Krish9676",
  location: "Pune, Maharashtra, India",
  languages: ["English (Fluent)", "Hindi (Fluent)", "Telugu (Native)"],
};

// ============================================================
// TRIPLE DOMAIN
// ============================================================
export const tripleDomain = [
  {
    icon: "🌾",
    title: "Agricultural Scientist",
    credential: "B.Sc. Hons., Agriculture University",
    description: "I understand crops, soil and farms from the ground up — the fluency that decides whether a model's output is agronomically meaningful or merely statistically valid.",
    color: "amber",
  },
  {
    icon: "📡",
    title: "Remote Sensing Expert",
    credential: "M.Sc. DA-IICT, Gandhinagar",
    description: "I turn satellite imagery into intelligence that drives decisions — from a single vegetation index to fused optical, radar and weather timelines.",
    color: "cyan",
  },
  {
    icon: "🤖",
    title: "Production ML Engineer",
    credential: "Core Founding Team · Elai AgriTech",
    description: "I design, ship and run these systems myself — from the model, through the service that serves it, to the alert a grower actually reads.",
    color: "green",
  },
];

// ============================================================
// EXPERIENCE
// ============================================================
export const experience = [
  {
    company: "Elai AgriTech Pvt Ltd",
    location: "Pune, Maharashtra",
    type: "Full-Time · Core Founding Team Member",
    duration: "Dec 2023 – Present (~2.5 years)",
    roles: [
      {
        title: "Data Science Intern",
        period: "Dec 2023 – Apr 2024",
        promoted: false,
        bullets: [
          "NDVI Forecasting: Developed LSTM-based deep learning models for multi-crop NDVI forecasting — capturing temporal dynamics of vegetation growth for reliable early-season trend prediction.",
          "Crop Classification Foundation: Built and validated the company's first crop classification pipeline using satellite imagery and multi-index features (NDVI, NDRE, NDMI), establishing the model architecture adopted in all subsequent production systems.",
          "Pipeline Engineering: Designed automated geospatial preprocessing workflows — cloud masking, atmospheric correction, temporal stacking — transforming raw satellite feeds into model-ready inputs.",
          "R&D Contribution: Supported foundational R&D into AI-driven precision agriculture, laying the groundwork for systems that would later scale to production.",
        ],
        tags: ["LSTM", "Sentinel-2", "GEE", "Python", "NDVI", "NDRE", "NDMI"],
      },
      {
        title: "Data Scientist",
        period: "May 2024 – Present",
        promoted: true,
        achievements: [
          {
            title: "Farm Boundary Delineation",
            detail: "CNN-based image segmentation system — 80% boundary precision across diverse agricultural landscapes.",
            tags: ["CNN", "Sentinel-2", "Landsat", "GDAL", "Rasterio", "GeoPandas"],
            metric: "80% precision",
          },
          {
            title: "Crop Classification & Yield Prediction",
            detail: "Ensemble ML + LSTM on multi-temporal data — 90% classification accuracy, 87% yield prediction 3-4 months ahead.",
            tags: ["Random Forest", "XGBoost", "LSTM", "TensorFlow", "GEE"],
            metric: "90% accuracy",
          },
          {
            title: "Pest & Disease Identification",
            detail: "300+ class AI system with ONNX, Grad-CAM explainability, and Llama-3 conversational agent — secured R&D funding.",
            tags: ["MobileNet", "ResNet", "ONNX", "Grad-CAM", "Llama-3", "FastAPI"],
            metric: "R&D funded ✓",
          },
          {
            title: "Automated Data Pipelines",
            detail: "End-to-end satellite data pipelines integrating GEE, Python, and cloud processing — 70% reduction in manual analysis.",
            tags: ["GEE", "Python", "Cloud Processing", "Automation"],
            metric: "70% time saved",
          },
          {
            title: "Real-Time Crop Monitoring",
            detail: "Time-series satellite data + ML for tracking crop growth, stress indicators, yield trajectories with interactive dashboards.",
            tags: ["Time-Series ML", "Dashboards", "Monitoring"],
            metric: "Real-time",
          },
          {
            title: "Elai Agri Chatbot",
            detail: "Conversational AI translating NDVI scores, crop health reports, and satellite assessments into plain-language guidance.",
            tags: ["LLM", "Conversational AI", "FastAPI"],
            metric: "Internal deployment",
          },
          {
            title: "Anomaly Detection",
            detail: "Automated systems for early identification of crop stress, disease outbreaks, and irrigation failures.",
            tags: ["Isolation Forest", "Anomaly Detection", "ML"],
            metric: "~25% crop loss reduction",
          },
        ],
        tags: ["FastAPI", "Docker", "MongoDB", "Redis", "Celery", "GitHub Actions"],
      },
    ],
  },
];

// ============================================================
// PROJECTS
// ============================================================
export type ProjectFilter =
  | "All"
  | "Precision Agriculture"
  | "Computer Vision"
  | "LLM & AI"
  | "Full-Stack"
  | "Carbon & ESG"
  | "AgriFinTech";

export interface Project {
  id: number;
  slug: string;
  title: string;
  domain: string;
  featured?: boolean;
  problem: string;
  impact: string;
  impactDetail: string;
  /** Technology stack. Omit where the project is presented as a capability
   *  showcase rather than an implementation. */
  stack?: string[];
  /** What the system does for a user, shown in place of a tech stack. */
  capabilities?: string[];
  filters: ProjectFilter[];
  compliance?: string;
  /** Short marker shown on the card, in outcome terms */
  scale?: string;
  /** True where a dedicated technical document backs the page */
  documented?: boolean;
}

export const projects: Project[] = [
  {
    id: 9,
    slug: "crop-monitoring-pipeline",
    title: "Enhanced Satellite Crop Monitoring & Decision-Support System",
    domain: "Precision Agriculture · Multi-Sensor Fusion",
    featured: true,
    scale: "Continuous farm-level monitoring, from sowing to harvest",
    problem:
      "Farm-level crop intelligence needs continuous monitoring across the whole season — weather intelligence, crop stress, pest and disease risk, nutrient status, yield trajectory, crop cycle and biomass — delivered to a farmer or agronomist without anyone touching a GIS.",
    impact: "Field-specific alerts, early enough to act on",
    impactDetail:
      "Turns a season of satellite observation into dated farm alerts with preventive and mitigation measures — irrigate here, scout for this pest, correct this deficiency, harvest in this window.",
    capabilities: [
      "Weather Intelligence",
      "Crop Stress & Stress Typing",
      "Pest & Disease Risk",
      "Crop Nutrients",
      "Yield Trajectory",
      "Crop Cycle & Harvest Timing",
      "Biomass Accumulation",
      "Farm Alerts & Advisories",
    ],
    filters: ["All", "Precision Agriculture", "Full-Stack"],
  },
  {
    id: 7,
    slug: "krishi-bhoomi-score",
    title: "Krishi Bhoomi Score — Satellite Agronomic Risk Index",
    domain: "AgriFinTech · Credit Analytics · Remote Sensing",
    featured: true,
    scale: "Three years of land history, read from orbit",
    problem:
      "A smallholder applying for a crop loan is usually invisible to conventional credit assessment — no bureau history, no farm-income statement, no reliable record of what was grown. The land, meanwhile, has been observed from orbit for a decade.",
    impact: "A lender-ready view of what the land has actually done",
    impactDetail:
      "Turns three years of observed cropping into an explainable risk score with the evidence attached — and says so plainly when the land cannot be seen well enough to judge.",
    capabilities: [
      "Land-Cover Verification",
      "Cropping History & Activity",
      "Vigour & Yield Potential",
      "Stress & Stability History",
      "Weather Resilience & Exposure",
      "Explainable Scoring",
      "Refusal States",
      "Multilingual Reporting",
    ],
    filters: ["All", "Full-Stack", "LLM & AI", "AgriFinTech"],
  },
  {
    id: 6,
    slug: "carbon-mrv-platform",
    title: "Satellite-Based Carbon MRV Platform",
    domain: "Climate-Tech · ESG · Carbon Markets",
    featured: true,
    scale: "All five carbon pools, monitored from orbit",
    problem:
      "Proving that a carbon project actually sequestered carbon is expensive enough to keep smaller developers out of the market entirely — so good projects either never happen, or happen without credible accounting.",
    impact: "Audit-ready carbon accounting without a field campaign for every claim",
    impactDetail:
      "Measures and monitors carbon across every pool, quantifies the uncertainty conservatively, explains each estimate, and produces the document a verifier expects.",
    capabilities: [
      "Project Area Mapping",
      "Biomass Estimation",
      "Soil Carbon Estimation",
      "Multi-Pool Accounting",
      "Stock-Change Monitoring",
      "Uncertainty Quantification",
      "Explainable Attribution",
      "Audit-Ready Reporting",
    ],
    filters: ["All", "Full-Stack", "Carbon & ESG"],
    compliance: "IPCC · Verra VM0042 · VM0047",
  },
  {
    id: 10,
    slug: "agentic-intelligence-layer",
    title: "Agentic AI & Tool-Native Intelligence Layer",
    domain: "Agentic AI · Decision Systems · Product Strategy",
    scale: "Ask the field, get an answer you can act on",
    problem:
      "A monitoring system that answers questions only when someone runs it is not intelligence anyone can build on. The gap is not model quality — it is the absence of an agent layer, a data-quality contract and explanations safe enough to narrate.",
    impact: "Agricultural intelligence any system can call directly",
    impactDetail:
      "An architecture where farmers, agronomists, lenders and sourcing teams each ask their own questions of the same grounded models — and where the answer refuses itself when the data cannot support it.",
    capabilities: [
      "Farmer Advisory Agent",
      "Agronomy Agent",
      "Credit & Risk Agent",
      "Sourcing Agent",
      "Portfolio Agent",
      "Evidence Graphs",
      "Data-Quality Contracts",
      "Native Tool Access",
    ],
    filters: ["All", "LLM & AI", "Full-Stack"],
  },
  {
    id: 3,
    slug: "pest-disease-identification",
    title: "Pest & Disease Identification System",
    domain: "Computer Vision · Explainable AI",
    scale: "300+ pest and disease classes, with the reasoning shown",
    problem:
      "A diagnosis nobody can check is a diagnosis nobody should act on. Farmers and agronomists need a fast identification that also shows what it looked at and admits when it is unsure.",
    impact: "A diagnosis a farmer can check, not just trust",
    impactDetail:
      "Identifies a pest or disease from a single photograph, shows which part of the leaf drove the answer, reports its own confidence, and explains the next step in plain language.",
    capabilities: [
      "Image-Based Diagnosis",
      "300+ Class Coverage",
      "Visual Explanation",
      "Confidence Reporting",
      "Plain-Language Guidance",
      "Field-Ready Inference",
    ],
    filters: ["All", "Computer Vision", "LLM & AI"],
  },
  {
    id: 2,
    slug: "crop-classification-yield",
    title: "Multi-Crop Classification & Yield Prediction",
    domain: "Precision Agriculture · Time-Series Analysis",
    scale: "Crop identity and yield, months before harvest",
    problem:
      "What is planted, and what will it yield — the two questions that drive every procurement, pricing and lending decision in an agricultural supply chain, traditionally answered by field visits that arrive too late to be useful.",
    impact: "Yield answers early enough to trade, lend and plan on",
    impactDetail:
      "Identifies the crop from the shape of its season and projects yield three to four months before harvest, turning a historical record into a planning input.",
    capabilities: [
      "Crop Type Identification",
      "Season-Shape Analysis",
      "Growth-Stage Detection",
      "Early Yield Forecasting",
      "Multi-Season Comparison",
      "Regional Aggregation",
    ],
    filters: ["All", "Precision Agriculture"],
  },
  {
    id: 1,
    slug: "farm-boundary-delineation",
    title: "Farm Boundary Delineation System",
    domain: "Precision Agriculture · Computer Vision",
    scale: "Field boundaries without a field visit",
    problem:
      "Every field-level number inherits its footprint from a boundary. Draw it by hand and the system is capped by how many polygons a person can trace; draw it wrong and every number computed inside it describes the wrong ground.",
    impact: "The trustworthy field outline everything else depends on",
    impactDetail:
      "Extracts field boundaries automatically from satellite imagery, verifies the area against what was declared, and flags the parcels too small or too uncertain to measure.",
    capabilities: [
      "Automated Boundary Extraction",
      "Multi-Resolution Imagery",
      "Area Verification",
      "Boundary Quality Assessment",
      "Regional-Scale Mapping",
    ],
    filters: ["All", "Precision Agriculture", "Computer Vision"],
  },
  {
    id: 8,
    slug: "regional-agri-intelligence",
    title: "Regional Agricultural Intelligence Platform",
    domain: "Agricultural Intelligence · Policy & Enterprise",
    scale: "District-scale crop intelligence, updated continuously",
    problem:
      "A policy team is not asking about one field. They need to know whether sowing is ahead or behind last year across a district, where drought is concentrating, and whether cultivated area is growing — answers that need coverage and consistency far more than per-pixel precision.",
    impact: "Regional answers at the resolution decisions are actually made",
    impactDetail:
      "Tracks crop health, drought concentration, sowing progress and land-use change across whole districts, compared against prior seasons rather than against an absolute threshold.",
    capabilities: [
      "Crop Health Tracking",
      "Drought Monitoring",
      "Sowing Progress",
      "Land-Use Change",
      "Season Comparison",
      "District Aggregation",
    ],
    filters: ["All", "Full-Stack"],
  },
  {
    id: 4,
    slug: "elai-agri-chatbot",
    title: "Conversational Crop-Intelligence Assistant",
    domain: "Conversational AI · Explainable Analytics",
    scale: "Satellite analytics, answered in plain language",
    problem:
      "Index time-series, severity distributions and confidence tiers are all correct and almost none of it is legible to the people whose decisions it exists to inform. That is not a wording problem — it is an adoption ceiling.",
    impact: "Analytics anyone can act on, without a GIS background",
    impactDetail:
      "Answers a plain question about a field with a plain answer, framed for whoever is asking — and never puts a number in a sentence that the analytics did not compute.",
    capabilities: [
      "Plain-Language Translation",
      "Audience-Aware Framing",
      "Grounded Answers",
      "Guided Next Actions",
      "Multilingual Delivery",
    ],
    filters: ["All", "LLM & AI"],
  },
  {
    id: 5,
    slug: "ai-data-collection-agent",
    title: "Semi-Automated AI Data Collection Agent",
    domain: "Dataset Engineering · AI Agents",
    scale: "Balanced training datasets, assembled automatically",
    problem:
      "Training a classifier across hundreds of pest and disease classes needs hundreds of balanced, correctly labelled image sets. Assembling those by hand is the step that silently caps how fast any vision project can move.",
    impact: "Removed the bottleneck that capped every model iteration",
    impactDetail:
      "Reaches the long tail of rare classes automatically, then filters hard enough that the dataset gets smaller and the model gets better.",
    capabilities: [
      "Automated Query Generation",
      "Multi-Source Retrieval",
      "Quality Filtering",
      "Duplicate Detection",
      "Class Balancing",
      "Targeted Augmentation",
    ],
    filters: ["All", "LLM & AI"],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

// ============================================================
// SKILLS
// ============================================================
export interface Skill {
  name: string;
  level: "Expert" | "Proficient" | "Familiar";
}

/** Bands the categories are grouped under, in display order. */
export const skillGroups = [
  "Earth Observation",
  "Modelling & AI",
  "Engineering & Delivery",
  "Domain Science & Standards",
] as const;

export type SkillGroup = (typeof skillGroups)[number];

export interface SkillCategory {
  category: string;
  icon: string;
  group: SkillGroup;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  // ── Earth Observation — the differentiating layer, so it leads ──────
  {
    category: "Geospatial & Remote Sensing",
    icon: "🛰️",
    group: "Earth Observation",
    skills: [
      { name: "Google Earth Engine", level: "Expert" },
      { name: "QGIS", level: "Expert" },
      { name: "ArcGIS", level: "Expert" },
      { name: "GDAL", level: "Expert" },
      { name: "Rasterio", level: "Expert" },
      { name: "GeoPandas", level: "Expert" },
      { name: "Shapely", level: "Expert" },
      { name: "ERDAS IMAGINE", level: "Proficient" },
      { name: "ENVI", level: "Proficient" },
      { name: "PostGIS", level: "Proficient" },
    ],
  },
  {
    category: "Satellite Data Sources",
    icon: "🌍",
    group: "Earth Observation",
    skills: [
      { name: "Sentinel-2 (optical)", level: "Expert" },
      { name: "Sentinel-1 (radar)", level: "Expert" },
      { name: "Landsat 8/9", level: "Expert" },
      { name: "MODIS", level: "Proficient" },
      { name: "Landsat thermal / LST", level: "Proficient" },
      { name: "HR Commercial Imagery", level: "Proficient" },
      { name: "MeteoBlue", level: "Proficient" },
      { name: "NASA POWER", level: "Proficient" },
      { name: "UAV / Drone Imagery", level: "Familiar" },
      { name: "LiDAR", level: "Familiar" },
    ],
  },
  {
    category: "Spectral & Radar Indices",
    icon: "📊",
    group: "Earth Observation",
    skills: [
      { name: "NDVI", level: "Expert" },
      { name: "NDRE", level: "Expert" },
      { name: "EVI", level: "Expert" },
      { name: "SAVI / MSAVI", level: "Expert" },
      { name: "NDMI", level: "Expert" },
      { name: "NDWI", level: "Expert" },
      { name: "PSRI", level: "Expert" },
      { name: "NBR", level: "Expert" },
      { name: "GCI", level: "Expert" },
      { name: "SIPI", level: "Expert" },
      { name: "IRECI / S2REP", level: "Proficient" },
      { name: "RVI (radar)", level: "Proficient" },
      { name: "Dual-pol ratio", level: "Proficient" },
      { name: "Water Cloud Model", level: "Proficient" },
    ],
  },

  // ── Modelling & AI ──────────────────────────────────────────────────
  {
    category: "Machine Learning",
    icon: "🤖",
    group: "Modelling & AI",
    skills: [
      { name: "Scikit-learn", level: "Expert" },
      { name: "XGBoost", level: "Expert" },
      { name: "LightGBM", level: "Expert" },
      { name: "Random Forest", level: "Expert" },
      { name: "Isolation Forest", level: "Expert" },
      { name: "Time-series modelling", level: "Expert" },
      { name: "SVM", level: "Proficient" },
      { name: "KNN", level: "Proficient" },
    ],
  },
  {
    category: "Deep Learning",
    icon: "🧠",
    group: "Modelling & AI",
    skills: [
      { name: "CNN", level: "Expert" },
      { name: "LSTM", level: "Expert" },
      { name: "Image segmentation", level: "Expert" },
      { name: "Transfer Learning", level: "Proficient" },
      { name: "MobileNet / ResNet", level: "Proficient" },
      { name: "Autoencoders", level: "Proficient" },
      { name: "TensorFlow / Keras", level: "Proficient" },
      { name: "PyTorch", level: "Proficient" },
    ],
  },
  {
    category: "Explainability & Uncertainty",
    icon: "🔍",
    group: "Modelling & AI",
    skills: [
      { name: "SHAP", level: "Expert" },
      { name: "Grad-CAM", level: "Expert" },
      { name: "Uncertainty quantification", level: "Expert" },
      { name: "Counterfactual reasoning", level: "Proficient" },
      { name: "Confidence calibration", level: "Proficient" },
    ],
  },
  {
    category: "LLMs & AI Agents",
    icon: "💬",
    group: "Modelling & AI",
    skills: [
      { name: "Prompt Engineering", level: "Expert" },
      { name: "Grounded generation", level: "Expert" },
      { name: "AI data collection agents", level: "Expert" },
      { name: "Groq SDK", level: "Expert" },
      { name: "Agent orchestration", level: "Proficient" },
      { name: "MCP tool servers", level: "Proficient" },
      { name: "Llama-3", level: "Proficient" },
      { name: "Ollama", level: "Proficient" },
      { name: "Sarvam (Indic)", level: "Familiar" },
    ],
  },

  // ── Engineering & Delivery ──────────────────────────────────────────
  {
    category: "Programming Languages",
    icon: "💻",
    group: "Engineering & Delivery",
    skills: [
      { name: "Python", level: "Expert" },
      { name: "SQL", level: "Proficient" },
      { name: "R", level: "Proficient" },
      { name: "JavaScript / TypeScript", level: "Familiar" },
    ],
  },
  {
    category: "MLOps & Deployment",
    icon: "🚀",
    group: "Engineering & Delivery",
    skills: [
      { name: "FastAPI", level: "Expert" },
      { name: "Docker / Compose", level: "Expert" },
      { name: "Celery", level: "Expert" },
      { name: "Async job pipelines", level: "Expert" },
      { name: "GitHub Actions CI/CD", level: "Proficient" },
      { name: "ONNX Runtime", level: "Proficient" },
      { name: "Flask", level: "Proficient" },
      { name: "Render / Netlify", level: "Proficient" },
    ],
  },
  {
    category: "Databases & Storage",
    icon: "🗄️",
    group: "Engineering & Delivery",
    skills: [
      { name: "MongoDB", level: "Expert" },
      { name: "Redis", level: "Proficient" },
      { name: "PostgreSQL", level: "Proficient" },
      { name: "Supabase", level: "Proficient" },
      { name: "MinIO / Cloudflare R2", level: "Proficient" },
    ],
  },
  {
    category: "Cloud & Infrastructure",
    icon: "☁️",
    group: "Engineering & Delivery",
    skills: [
      { name: "AWS S3", level: "Proficient" },
      { name: "AWS EC2", level: "Proficient" },
      { name: "AWS ECS / Fargate", level: "Proficient" },
      { name: "AWS Lambda", level: "Proficient" },
      { name: "AWS SageMaker", level: "Proficient" },
      { name: "Google Cloud Platform", level: "Familiar" },
    ],
  },
  {
    category: "Visualisation & Frontend",
    icon: "🎨",
    group: "Engineering & Delivery",
    skills: [
      { name: "Matplotlib / Seaborn", level: "Expert" },
      { name: "Hand-built SVG charts", level: "Expert" },
      { name: "Leaflet / React-Leaflet", level: "Proficient" },
      { name: "Recharts / Plotly", level: "Proficient" },
      { name: "Next.js", level: "Proficient" },
      { name: "React", level: "Proficient" },
      { name: "Power BI / Tableau", level: "Proficient" },
      { name: "Tailwind CSS", level: "Familiar" },
    ],
  },

  // ── Domain Science & Standards ──────────────────────────────────────
  {
    category: "Agronomy & Crop Science",
    icon: "🌾",
    group: "Domain Science & Standards",
    skills: [
      { name: "Crop Physiology", level: "Expert" },
      { name: "Phenology & Growth Stages", level: "Expert" },
      { name: "Agronomy", level: "Expert" },
      { name: "Indian Cropping Systems", level: "Expert" },
      { name: "Soil Science", level: "Proficient" },
      { name: "Plant Pathology", level: "Proficient" },
      { name: "Nutrient Management", level: "Proficient" },
      { name: "Irrigation Management", level: "Proficient" },
      { name: "Agrometeorology", level: "Proficient" },
    ],
  },
  {
    category: "Carbon & ESG Standards",
    icon: "🌿",
    group: "Domain Science & Standards",
    skills: [
      { name: "IPCC Carbon Accounting", level: "Expert" },
      { name: "Verra VM0042", level: "Expert" },
      { name: "Verra VM0047", level: "Expert" },
      { name: "Multi-pool carbon accounting", level: "Expert" },
      { name: "Chave 2014 Allometrics", level: "Proficient" },
      { name: "Baseline & additionality", level: "Proficient" },
    ],
  },
];

// ============================================================
// DOMAIN EXPERTISE
// ============================================================
export const domainExpertise = [
  {
    icon: "🛰️",
    title: "Agricultural Remote Sensing & Precision Agriculture",
    description: "Designing and deploying satellite-based monitoring systems for crop health, growth stage detection, stress identification, and yield estimation. Deep expertise in multi-temporal imagery, phenological analysis, and vegetation index computation at field and regional scale.",
    color: "green",
  },
  {
    icon: "🗺️",
    title: "Geospatial Data Science & Spatial Analytics",
    description: "End-to-end geospatial workflows: data ingestion, spatial preprocessing, feature engineering, interpolation, terrain analysis, and spatial statistics — across GEE, QGIS, ArcGIS, PostGIS, GeoPandas, and GDAL.",
    color: "cyan",
  },
  {
    icon: "🤖",
    title: "ML & Deep Learning for Earth Observation",
    description: "Building production ML/DL systems (CNN, LSTM, ensembles) trained on multi-spectral satellite imagery for classification, segmentation, anomaly detection, and time-series forecasting in agricultural and environmental contexts.",
    color: "green",
  },
  {
    icon: "🌿",
    title: "Carbon MRV & ESG Intelligence",
    description: "Implementing scientifically rigorous, audit-compliant carbon MRV workflows using IPCC and Verra (VM0042/VM0047) standards — covering all carbon pools with uncertainty quantification and explainable AI outputs.",
    color: "amber",
  },
  {
    icon: "💳",
    title: "AgriFinTech — Satellite Farm Credit Scoring",
    description: "Designing novel credit intelligence systems combining satellite time-series, ML, and LLM technologies to automate farm credit assessment — enabling inspection-free lending to smallholder farmers at scale.",
    color: "cyan",
  },
  {
    icon: "💬",
    title: "AI/LLM Integration for Agriculture & Climate",
    description: "Integrating large language models (Groq/Llama-3, Sarvam) into geospatial pipelines for explainable narratives, diagnostic reports, multilingual outputs, and conversational interfaces accessible to non-technical users.",
    color: "green",
  },
  {
    icon: "🏗️",
    title: "Full-Stack Data Product Development",
    description: "Independently architecting and shipping full-stack data products: FastAPI backends, MongoDB/PostgreSQL, Celery async workers, React/Next.js dashboards, Docker infrastructure, and GEE-integrated satellite pipelines.",
    color: "cyan",
  },
  {
    icon: "🌾",
    title: "Agricultural Domain Knowledge",
    description: "Deep foundational understanding of crop physiology, growth stages, soil science, phenology, agronomy, and Indian agricultural systems — enabling domain-aware model design and scientifically valid interpretation of remote sensing outputs.",
    color: "amber",
  },
];

// ============================================================
// EDUCATION
// ============================================================
export const education = [
  {
    degree: "M.Sc. Data Analytics",
    institution: "Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)",
    location: "Gandhinagar, Gujarat",
    duration: "2022 – 2024",
    cgpa: "7.1 / 10",
    specialization: "Agriculture Analytics",
    coursework: [
      "Python Programming",
      "GIS & Remote Sensing",
      "Spatial Data Analysis",
      "Crops & Soil Analytics",
      "Machine Learning",
      "Deep Learning",
      "Image Analysis",
      "Statistical Modeling",
      "Data Structures",
    ],
    icon: "🎓",
    color: "green",
  },
  {
    degree: "B.Sc. (Hons.) Agriculture",
    institution: "Dr. Panjabrao Deshmukh Krishi Vidyapeeth (Agriculture University)",
    location: "Akola, Maharashtra",
    duration: "2018 – 2022",
    cgpa: "7.67 / 10",
    specialization: null,
    coursework: [
      "Agronomy",
      "Soil Science",
      "Crop Physiology",
      "Plant Pathology",
      "Agricultural Economics",
      "Horticulture",
      "Irrigation Management",
    ],
    icon: "🌾",
    color: "amber",
  },
];
