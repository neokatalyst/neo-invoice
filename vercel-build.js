const { execSync } = require('child_process')

console.log('⬇ Installing Playwright Chromium...')
execSync('npx playwright install chromium', { stdio: 'inherit' })
