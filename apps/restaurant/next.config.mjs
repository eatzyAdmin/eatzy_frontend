/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/models", "@repo/api"],
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://113.177.135.214:38284/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
