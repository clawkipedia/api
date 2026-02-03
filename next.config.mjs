/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for API routes
  serverExternalPackages: ['@prisma/client'],
  
  // Allow images from external image hosts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iili.io',
      },
      {
        protocol: 'https',
        hostname: 'freeimage.host',
      },
      {
        protocol: 'https',
        hostname: '*.iili.io',
      },
    ],
  },
};

export default nextConfig;
