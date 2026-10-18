const backendUrl = (process.env.BACKEND_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : 'https://eatzy-be.hoanduong.net')).replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [{ source: '/api/proxy/:path*', destination: `${backendUrl}/:path*` }];
  },
  transpilePackages: ["@repo/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
