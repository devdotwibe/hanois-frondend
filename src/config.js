/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hanois.dotwibe.com',
        pathname: '/api/**',
      },
    ],
  },
};

// Constants
const API_URL = 'https://hanois.dotwibe.com/api/api/';
const IMG_URL = 'https://hanois.dotwibe.com/api/';
const SITE_URL = 'https://hanois.dotwibe.com/';
// const API_URL = 'http://localhost:5000/api/';

// Export both config and constants
module.exports = {
  ...nextConfig,
  API_URL,
  IMG_URL,
  SITE_URL,
};
