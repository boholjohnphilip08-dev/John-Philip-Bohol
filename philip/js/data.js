/* =============================================================================
   PORTFOLIO CONTENT — edit this file to personalise the whole site.
   Everything marked  ⟵ REPLACE  is placeholder content.
   ========================================================================== */

window.PORTFOLIO = {
  /* ---------- Identity ---------- */
  name: "John Philip Bohol",
  initials: "JP",                       // used for the logo/monogram
  roles: ["Aspiring Web Designer", "UI/UX Design", "Building with Python & Django"],   // typed one after another in the hero
  intro:
    "I am a passionate CS student interested in web development, programming, and creating useful digital solutions. I enjoy turning ideas into functional applications and continuously improving my skills through hands-on projects. I'm currently exploring technologies like HTML, CSS, JavaScript, Python, and Django.",

  /* Profile photo. Put your image in assets/img/ and point to it here.
     Square images (800×800 or larger) work best.                         */
  profileImage: "assets/img/profile.webp",

  /* CV / résumé. Put a PDF in assets/ and set the path, e.g. "assets/Philip-CV.pdf".
     While empty, the "Download CV" button is hidden. */
  cvUrl: "",                            // ⟵ REPLACE

  /* ---------- Contact ---------- */
  email: "boholjohnphilip08@gmail.com",
  phone: "0936 825 5765",               // shown on the page
  phoneLink: "+639368255765",           // international format used for tap-to-call

  /* Optional: a form backend such as Formspree (https://formspree.io).
     Paste your endpoint (e.g. "https://formspree.io/f/abcdwxyz") and the form
     will send messages directly. While empty, the form opens the visitor's
     email app with the message pre-filled — nothing is faked.             */
  formEndpoint: "",

  /* Leave url empty ("") to hide a link. icon: github | linkedin | facebook | x | instagram | mail */
  socials: [
    { label: "John Philip Bohol", url: "https://www.facebook.com/philip.bohol.315", icon: "facebook" },
    { label: "GitHub",   url: "", icon: "github" },   // ⟵ add your GitHub URL to show it
    { label: "LinkedIn", url: "", icon: "linkedin" }  // ⟵ add your LinkedIn URL to show it
  ],

  /* ---------- About ---------- */
  highlights: [
    {
      icon: "education",
      title: "Education",
      subtitle: "Biliran Province State University",
      meta: "School of Technology and Computer Studies",
      text: "Pursuing my education in technology and computer studies, where I continue to develop my knowledge of programming, software development, and information technology."
    },
    {
      icon: "spark",
      title: "Areas of Interest",
      items: [
        { label: "Web Development", text: "Building responsive, functional, and user-friendly web applications." },
        { label: "UI/UX Design", text: "Creating clean interfaces with a focus on usability and user experience." },
        { label: "Full-Stack Development", text: "Working with both front-end interfaces and back-end systems." },
        { label: "Educational Technology", text: "Developing digital solutions that make learning and teaching more accessible." }
      ]
    },
    {
      icon: "compass",
      title: "Development Philosophy",
      text: "I believe good development starts with understanding the problem and the people using the product. I value clean and maintainable code, thoughtful design, and functionality that serves a real purpose. I prefer building something that works well, then continuously improving it through testing, feedback, and iteration."
    },
    {
      icon: "target",
      title: "Career Goals",
      text: "My goal is to grow into a skilled and well-rounded full-stack developer capable of taking an idea from concept to deployment. I want to continue exploring new technologies, strengthen my development skills, and contribute to building reliable digital products that solve real-world problems."
    }
  ],

  /* ---------- Projects ----------
     categories: any of "web", "uiux", "academic", "other"
     Set featured: true on ONE project for the large showcase layout.
     Set placeholder: true for empty slots (rendered as "add a project" cards). */
  projects: [
    {
      id: "numify",
      featured: true,
      title: "NUMIFY",
      fullTitle:
        "NUMIFY: A Teacher-Assisted Gamified Numeracy Assessment System for Junior High School Students",
      categories: ["web", "academic"],
      categoryLabel: "Web Development · Academic",
      description:
        "A web-based educational platform that supports mathematics assessment and learner engagement through gamification.",
      longDescription:
        "NUMIFY gives teachers tools to manage assessments and monitor performance, while helping students improve their numeracy skills through automated assessment, personalised learning recommendations and parallel practice assessments — all wrapped in a gamified experience that keeps learners engaged.",
      features: [
        "Teacher-side assessment management",
        "Student performance monitoring",
        "Automated assessment and scoring",
        "Personalised learning recommendations",
        "Parallel practice assessments",
        "Gamified learner experience"
      ],
      tech: ["Python", "Django", "PostgreSQL", "HTML", "CSS", "JavaScript"],
      image: "assets/img/projects/numify.webp",
      liveUrl: "https://gamified-system.onrender.com/",
      repoUrl: "" // add a GitHub URL to show the repository button
    },
    {
      id: "stockguard",
      title: "StockGuard",
      fullTitle: "StockGuard: Smart Inventory Monitoring System",
      categories: ["web"],
      categoryLabel: "Web Development",
      description:
        "A web-based inventory monitoring system that helps store managers keep track of their products and stock levels in one place. It features a dashboard that summarizes total products, units in stock and items needing restock, alerts the user when products reach or fall below their reorder level, and lets them search, filter, add, edit and delete products with ease.",
      longDescription:
        "StockGuard gives store managers a clear overview of their inventory. The dashboard summarises total products, units in stock and items needing restock, and raises an alert when products reach or fall below their reorder levels. The inventory view makes it quick to find, filter and manage every product.",
      features: [
        "Dashboard with inventory summary cards",
        "Low-stock alerts based on reorder levels",
        "Search by product name or category",
        "Filter by category and stock status",
        "Add, edit and delete products",
        "Quantity, reorder level and price per product"
      ],
      tech: [],          // ⟵ add the technologies you used, e.g. ["HTML", "CSS", "JavaScript"]
      image: "assets/img/projects/stockguard.webp",
      liveUrl: "",       // ⟵ add a live link to show the Live Demo button
      repoUrl: ""
    }
    /* To add another project, copy this template below NUMIFY:
    ,{
      id: "my-project",
      title: "Project name",
      categories: ["web"],               // web | uiux | academic | other
      categoryLabel: "Web Development",
      description: "One or two sentences about it.",
      tech: ["HTML", "CSS"],
      image: "assets/img/projects/my-project.webp",
      liveUrl: "",
      repoUrl: ""
    }
    */
  ],

  /* ---------- Skills ----------
     Technology stack shown as official logos (assets/img/skills).
     "glow" is the hover glow colour, taken from each brand palette.    */
  skills: [
    { name: "HTML5", logo: "assets/img/skills/html5.svg", glow: "#e44d26" },
    { name: "CSS3", logo: "assets/img/skills/css3.svg", glow: "#1572b6" },
    { name: "JavaScript", logo: "assets/img/skills/javascript.svg", glow: "#f0db4f" },
    { name: "Python", logo: "assets/img/skills/python.svg", glow: "#3776ab" },
    { name: "Django", logo: "assets/img/skills/django.svg", logoLight: "assets/img/skills/django-dark.svg", glow: "#44b78b", wide: true },
    { name: "PostgreSQL", logo: "assets/img/skills/postgresql.svg", glow: "#336791" }
  ],

  /* ---------- Awards & Achievements ----------
     category: "academic" | "certificate" | "training" | "competition"
     image: path to a scan/photo of the certificate (JPG/PNG/SVG).
     Newest first. */
  awards: [
    {
      category: "training",
      title: "Thesis Preparation with the Use of Trending Tools and Industry Practices",
      org: "Biliran Province State University — School of Technology and Computer Studies, Computer Science Society",
      date: "October 6–7, 2025",
      description:
        "Certificate of Completion for a two-day seminar-workshop held at the BiPSU Student Center.",
      image: "assets/img/certificates/bipsu-thesis-seminar.webp"
    },
    {
      category: "training",
      title: "Integrated OS – Be More Digi-TALINO",
      org: "Integrated Office Solutions, Inc.",
      date: "September 5, 2025",
      description:
        "Certificate of Participation for a webinar via Zoom on digital literacy: productivity apps, digital communication, smart research, and data safety and security.",
      image: "assets/img/certificates/integrated-os-webinar.webp"
    }
  ]
};
