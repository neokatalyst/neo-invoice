// vercel-build.js
const { execSync } = require('child_process')

try {
  console.log('📥 Installing Playwright Chromium...')
  execSync('npx playwright install chromium', { stdio: 'inherit' })
  console.log('✅ Playwright Chromium installed successfully.')
} catch (error) {
  console.error('❌ Failed to install Playwright Chromium:', error)
  process.exit(1)
}
