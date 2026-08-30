import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Default Next.js only serves images at quality 75. Product photos need to
    // look sharp when zoomed on the detail page, so allow higher-quality tiers.
    qualities: [75, 85, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Admin product-photo uploads (actions.ts) need room for real camera/
      // supplier photos (often 5-15MB) before sharp downsizes them.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
