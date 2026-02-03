/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for API routes
  serverExternalPackages: ['@prisma/client'],
  
  // Allow images from Vercel Blob storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
