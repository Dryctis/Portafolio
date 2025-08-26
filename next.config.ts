import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    
    formats: ["image/avif", "image/webp"],
    
    deviceSizes: [360, 640, 828, 1080, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64],
  
  },

  experimental: {
    
    optimizePackageImports: ["react-icons"],
  },

 

  async headers() {
    return [
      {
       
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        
        source: "/cv/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        // Si usas fuentes locales en /public/fonts
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
