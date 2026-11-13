// All portfolio content lives here, sourced from Chetan's resume.
// Edit this file to update the site — components read from it.

export const profile = {
  name: 'Chetan Suthar',
  first: 'Chetan',
  last: 'Suthar',
  role: 'Full-Stack Web Developer',
  stack: 'MERN Stack',
  location: 'Ahmedabad, Gujarat 380054',
  city: 'Ahmedabad, India',
  email: 'csuthar0609@gmail.com',
  phone: '+91 99989 58207',
  phoneHref: 'tel:+919998958207',
  linkedin: 'https://www.linkedin.com/in/chetansuthar/',
  github: 'https://github.com/chetansuthar0609',
  rotating: ['Full-Stack Developer', 'MERN Stack Engineer', 'React Specialist', 'API Architect', 'AI-Assisted Builder'],
  summary:
    'Full-Stack Developer who builds responsive, high-performance web applications across the frontend and backend. Currently developing a real estate platform at Unada Labs Pvt. Ltd., with hands-on experience in user interfaces, RESTful APIs, databases, and AI-assisted development. Known for writing clean, reliable code and delivering practical solutions efficiently.',
}

// `num` values count up when they scroll into view; `value` is shown as-is.
export const stats = [
  { value: 'MERN', label: 'Core stack' },
  { num: 8.57, decimals: 2, label: 'B.E. CGPA' },
  { num: 4, label: 'Languages spoken' },
  { num: 2025, from: 2019, label: 'In production since' },
]

export const statement =
  'I design interfaces, engineer APIs and ship full-stack products that feel effortless — fast on every screen, reliable under the hood.'

export const skillGroups = [
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'Pixel-tight, responsive interfaces.',
    items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'APIs that are predictable and fast.',
    items: ['Node.js', 'Express.js', 'RESTful APIs'],
  },
  {
    id: 'data',
    title: 'Databases',
    blurb: 'Document and relational data modeling.',
    items: ['MongoDB', 'MySQL'],
  },
  {
    id: 'ai',
    title: 'AI Tools',
    blurb: 'AI-assisted coding, debugging and testing.',
    items: ['Claude AI', 'AI pair programming', 'Prompt-driven debugging'],
  },
  {
    id: 'tools',
    title: 'Tooling',
    blurb: 'A workflow built for shipping.',
    items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Antigravity'],
  },
]

// Words orbiting in the 3D skill sphere
export const sphereWords = [
  'React', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'JavaScript', 'ES6+', 'HTML5', 'CSS3',
  'Tailwind', 'REST', 'Git', 'GitHub', 'Postman', 'VS Code', 'Claude AI', 'Antigravity', 'JSON',
  'JWT', 'Responsive', 'APIs', 'MERN',
]

export const experience = [
  {
    company: 'Unada Labs Pvt. Ltd.',
    role: 'MERN Stack Developer',
    period: 'Jul 2025 — Present',
    current: true,
    points: [
      'Developed and maintained responsive web applications using React.js, Node.js, Express.js, and MongoDB.',
      'Designed and integrated RESTful APIs to connect frontend interfaces with backend services.',
      'Leveraged AI-assisted development tools to accelerate coding, debugging, and testing workflows.',
      'Collaborated with designers and cross-functional teams to deliver features on schedule and resolve production issues.',
      'Built a full-stack real estate platform with property listings, search and filtering, and detailed property pages.',
    ],
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'AI tooling'],
  },
]

export const projects = [
  {
    id: 'estate',
    featured: true,
    kicker: 'Unada Labs · Production',
    title: 'Real Estate Platform',
    description:
      'A full-stack property marketplace: browsable listings, fast search with layered filters, and rich detail pages — backed by a RESTful Node/Express API and MongoDB.',
    features: ['Property listings', 'Search & filtering', 'Detailed property pages', 'RESTful API layer'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    id: 'portfolio',
    kicker: 'Personal · Open source',
    title: 'Immersive 3D Portfolio',
    description:
      'This site. A React app with a real-time WebGL hero, a 3D skill sphere, scroll-driven motion and a fully responsive layout tuned for 60fps.',
    features: ['React Three Fiber', 'Framer Motion', 'Scroll reveals', 'Reduced-motion aware'],
    stack: ['React', 'Three.js', 'Framer Motion', 'Vite'],
    link: 'https://chetansuthar0609.github.io/Portfolio/',
  },
  {
    id: 'api',
    kicker: 'Engineering focus',
    title: 'REST API Foundations',
    description:
      'The backbone behind the products I build: clean Express routing, validated payloads, MongoDB/MySQL models and Postman-tested endpoints that frontends can trust.',
    features: ['Express routing', 'Data modeling', 'Postman testing', 'Error handling'],
    stack: ['Node.js', 'Express', 'MongoDB', 'MySQL'],
  },
]

export const education = {
  school: 'Ahmedabad Institute of Technology',
  degree: 'Bachelor of Engineering',
  period: '2019 — 2023',
  cgpa: '8.57',
}

export const softSkills = [
  'Analytical Problem-Solving',
  'Teamwork & Collaboration',
  'Clear Communication',
  'Adaptability & Flexibility',
  'Time Management & Organization',
  'Self-Motivation & Initiative',
]

export const languages = ['English', 'Hindi', 'Gujarati', 'Rajasthani']

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]
