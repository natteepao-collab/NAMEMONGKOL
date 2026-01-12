import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ykujxndttruqzhmufdzr.supabase.co',
      },
    ],
  },
};

export default nextConfig;
