/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore type errors during production build to avoid
    // .next/dev/types stubs referencing non-emitted route.js modules
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hangart.pythonanywhere.com',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
