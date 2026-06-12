/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NEXT_PUBLIC_API_URL is injected at build time via Dockerfile ARG → ENV
  // Do NOT hardcode localhost here — it gets baked into the production bundle
}

module.exports = nextConfig
