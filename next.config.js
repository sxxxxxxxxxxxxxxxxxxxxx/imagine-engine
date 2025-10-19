/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 限制图片域名白名单，提升安全性
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'generativelanguage.googleapis.com',
        pathname: '/v1beta/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'newapi.pockgo.com',
      },
      {
        protocol: 'https',
        hostname: '*.modelscope.cn',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PicoTrex/Awesome-Nano-Banana-images/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudflarer2.nananobanana.com',
      },
      // 开发环境允许localhost
      ...(process.env.NODE_ENV === 'development' ? [
        {
          protocol: 'http',
          hostname: 'localhost',
        }
      ] : [])
    ],
    // 启用现代图片格式
    formats: ['image/avif', 'image/webp'],
    // 设备尺寸优化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // 启用 standalone 输出以支持 Docker 部署
  output: 'standalone',
  // 启用构建时的 ESLint 检查（开发环境严格，生产环境宽松）
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // 启用构建时的 TypeScript 类型检查
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  // 性能优化
  experimental: {
    // 优化包导入
    optimizePackageImports: ['lucide-react', 'react-markdown'],
  },
  // 生产环境移除console.log
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'], // 保留错误和警告日志
      },
    },
  }),
  // 启用压缩
  compress: true,
  // 安全：隐藏技术栈信息
  poweredByHeader: false,
  // 严格模式
  reactStrictMode: true,
  // 生产环境优化
  swcMinify: true,
}

module.exports = nextConfig