import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: ['placehold.co', 'images.unsplash.com', 'imgur.com', 'i.imgur.com', 'cloudinary.com', 'res.cloudinary.com'],
  },
};

export default nextConfig;
