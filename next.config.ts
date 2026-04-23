import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Bypass TypeScript build errors
  images: {
    remotePatterns: [new URL('https://uhtfc-cloudflare.vaughn-710.workers.dev/api/media/file/**')],
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Your existing configuration
  serverExternalPackages: [
    'jose',
    'pg-cloudflare',
    'drizzle-kit',
    'drizzle-kit/api',
    '@payloadcms/db-d1-sqlite',
    '@next/env',
  ],

  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
