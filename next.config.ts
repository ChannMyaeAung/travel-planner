import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce the work Turbopack does for these large barrel-file packages at dev time.
  experimental: {
    optimizePackageImports: ["lucide-react", "@dnd-kit/core", "@dnd-kit/sortable"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xe6kyelrve.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Silence known harmless "can't resolve 'fs'" warnings from heavy
  // client-side libs like react-globe.gl and @react-google-maps/api
  webpack(config) {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};

export default nextConfig;
