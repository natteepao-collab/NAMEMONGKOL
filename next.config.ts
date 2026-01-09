import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ykujxndttruqzhmufdzr.supabase.co',
      },
    ],
  },
};

export default nextConfig;
