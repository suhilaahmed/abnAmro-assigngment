import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  reporter: [['allure-playwright']],
  timeout: 60000,
  retries: 0,
  testDir: 'tests/api',
  use: {
    trace: 'retain-on-failure',
    baseURL: 'https://gitlab.com/api/v4/',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 300000,
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'off',
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'Webkit',
      use: { browserName: 'webkit' },
    },
  ],
}

export default config
