import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import withBundleAnalyzer from '@next/bundle-analyzer';

// Derive Supabase host at build time so Next/Image allows the correct domain in each env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const remotePatterns: RemotePattern[] = [
  // Supabase storage public URLs
  ...(supabaseHost ? [{ protocol: 'https' as const, hostname: supabaseHost }] : []),
  // Legacy CDN bucket
  {
    protocol: 'https',
    hostname: 'img5.pic.in.th',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'canvas-confetti', 'date-fns'],
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
