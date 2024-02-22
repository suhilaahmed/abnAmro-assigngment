import { defineConfig } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  use: {
    baseURL: 'https://gitlab.com/api/v4/',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
})
