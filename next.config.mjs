/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for API routes
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
