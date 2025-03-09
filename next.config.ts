import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: [
      "www.angeljackets.com",
      "images.unsplash.com", // Include this if you're using Unsplash images
      "placehold.co", // Include this if you're using placeholder images
    ],
  },
  // Add any other Next.js configuration options here
};

export default nextConfig;
