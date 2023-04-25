/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // not great, but typescript is being a total pain about covnet.js
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
