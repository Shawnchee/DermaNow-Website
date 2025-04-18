import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['placehold.co', 'images.pexels.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
