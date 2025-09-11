import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "xe6kyelrve.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
