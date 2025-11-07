import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hanois.dotwibe.com",
        pathname: "/api/banner/**", // allow banner images from backend
      },
    ],
  },
};

export default nextConfig;
