/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
  reactStrictMode: true
};

module.exports = nextConfig;