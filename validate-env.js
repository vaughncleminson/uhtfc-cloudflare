// validate-env.js
const REQUIRED_VARS = ['PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL']

console.log('🔍 Validating environment variables...')

const missing = REQUIRED_VARS.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error('❌ Build failed: Missing required environment variables:')
  missing.forEach((key) => console.error(`   - ${key}`))
  // Exit with a non-zero code to stop the Cloudflare build immediately
  process.exit(1)
}

console.log('✅ All required environment variables are present.')
process.exit(0)
