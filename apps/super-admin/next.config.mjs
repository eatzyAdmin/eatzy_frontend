/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/super-admin",
  transpilePackages: ["@repo/ui", "@repo/models", "@repo/api"],
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://113.177.135.214:38284/:path*', // Proxy to Backend
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;
