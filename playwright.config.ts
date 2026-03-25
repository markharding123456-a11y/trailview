import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'npx next dev -p 3000',
    port: 3000,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
