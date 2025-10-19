import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["https://nwbgobqaazltwhxpusdv.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nwbgobqaazltwhxpusdv.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
