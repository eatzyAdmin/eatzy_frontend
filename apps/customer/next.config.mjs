/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/customer",
  transpilePackages: ["@repo/ui", "@repo/models"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
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
