/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ["@repo/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
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
