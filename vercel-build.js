const { execSync } = require('child_process')

try {
  console.log('📥 Installing Playwright browsers...')
  execSync('npx playwright install --with-deps', { stdio: 'inherit' })
  console.log('✅ Playwright browsers installed successfully.')
} catch (error) {
  console.error('❌ Failed to install Playwright browsers:', error)
  process.exit(1)
}
