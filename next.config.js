/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // 启用 standalone 输出以支持 Docker 部署
  output: 'standalone',
  // 禁用构建时的 ESLint 检查（生产环境）
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 禁用构建时的 TypeScript 类型检查（生产环境）
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig