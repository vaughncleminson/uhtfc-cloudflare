import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import { withPayload } from '@payloadcms/next/withPayload'
import { config as loadDotenv } from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'
initOpenNextCloudflareForDev()

// Load build-time git vars written by scripts/set-build-env.mjs
// override:true so the script's resolved branch wins over any stale env var
if (existsSync('.env.build')) loadDotenv({ path: '.env.build', override: true })

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
    webpackConfig.resolve = webpackConfig.resolve || {}
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      '@payload-config': path.resolve(process.cwd(), 'src/payload.config.ts'),
    }

    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
