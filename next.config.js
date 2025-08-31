/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@hono/node-server']
  }
}

module.exports = nextConfig 