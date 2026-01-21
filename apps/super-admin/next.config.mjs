/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ["@repo/ui", "@repo/models", "@repo/api"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://eatzy-be.hoanduong.net/:path*', // Proxy to Backend
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow ALL https hostnames
      },
      {
        protocol: "http",
        hostname: "**", // Allow ALL http hostnames (for dev)
      },
    ],
  },
};

export default nextConfig;
