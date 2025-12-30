/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/models", "@repo/api"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Existing or likely needed domains
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://eatzy-be.hoanduong.net/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
