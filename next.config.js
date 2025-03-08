/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Static HTML export for Electron
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features not needed in Electron
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig; 