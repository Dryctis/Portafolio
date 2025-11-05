export type Project = {
  slug: string;
  title: string;
  blurb: string;
  image?: string;
  tags: string[];
  live?: string;
  repo?: string;
};

export const projects: Project[] = [
 
  {
    slug: "postify-cms",
    title: "Postify CMS",
    blurb:
      "CMS para blogs con CRUD de artículos y categorías, búsqueda/filtrado con DataTables, subida de imágenes, autenticación y roles. ASP.NET Core 9 (MVC) + EF Core + SQL Server + Bootstrap.",
    image: "/img/postify-cms.webp",
    tags: [
      "C#", "ASP.NET Core", "MVC", "Entity Framework", "SQL Server",
      "Bootstrap", "DataTables", "Auth", "Roles"
    ],
    repo: "https://github.com/Dryctis/Postify-CMS"
  },

  
  {
    slug: "clinic-manager",
    title: "Clínica Vida y Salud — API + Frontend",
    blurb:
      "API REST para gestión de pacientes, servicios y citas con auth JWT. Backend en Node.js/Express + Prisma/PostgreSQL (Railway) y frontend en React + TypeScript (Vite).",
    image: "/img/clinic-manager.webp",
    tags: [
      "Node.js", "Express", "Prisma", "PostgreSQL", "JWT", "Bcrypt", "Railway",
      "React", "TypeScript", "Vite"
    ],
    live: "https://clinica-salud-frontend.vercel.app",
  },

  
  {
    slug: "bigotes-y-colitas",
    title: "Bigotes & Colitas",
    blurb:
      "Landing / e-commerce veterinario. Frontend en Angular (TypeScript), desplegado en Netlify.",
    image: "/img/bigotes-colitas.webp",
    tags: ["Angular", "TypeScript", "Netlify"],
    live: "https://bigotes-y-colitas.netlify.app/",
  },

  
  {
    slug: "landing-henna",
    title: "Landing Veloz y Moderna",
    blurb:
      "Landing page rápida y optimizada con diseño moderno, secciones dinámicas y excelente puntuación de rendimiento.",
    image: "/img/landing-henna.webp",
    tags: ["Next.js", "Tailwind", "Vercel", "SEO"],
    live: "https://demo-landing-henna.vercel.app",
    repo: "https://github.com/Dryctis/Demo-Landing",
  },

 
  {
    slug: "bravia-inversion",
    title: "Bravia Inversión",
    blurb:
      "Landing corporativa financiera con hero animado, secciones de valor y diseño elegante enfocado en confianza y claridad.",
    image: "/img/bravia-inversion.webp",
    tags: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    live: "https://demo-landing2.vercel.app",
    repo: "https://github.com/Dryctis/Demo-Landing2",
  },
];
