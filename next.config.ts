import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
    reactStrictMode: true,
  compiler: {
    reactRemoveProperties: false,
  },
};

export default nextConfig;
