/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: [] },
  experimental: { serverComponentsExternalPackages: ["bcryptjs"] },
};
module.exports = nextConfig;
