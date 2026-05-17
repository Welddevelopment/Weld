/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid parallel webpack worker on Windows — intermittent PageNotFoundError
  // ("Cannot find module for page") during "Collecting page data" / production builds.
  experimental: {
    webpackBuildWorker: false
  }
};

export default nextConfig;
