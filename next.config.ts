/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: "edge",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
