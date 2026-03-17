import { CapacitorConfig } from '@capacitor/cli'

const isProd = process.env.NODE_ENV === 'production'

const config: CapacitorConfig = {
  appId: 'com.dev.next01',
  appName: 'Dev_Next01',
  webDir: '.next',
  server: isProd
    ? {
        url: 'https://your-production-url.com',
        cleartext: false,
      }
    : undefined,
}

export default config
