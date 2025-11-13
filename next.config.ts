import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["https://wfluxkclddzzzcgoioeb.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wfluxkclddzzzcgoioeb.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '60mb', 
    },
  },
};


export default nextConfig;
