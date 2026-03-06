import { spawn } from 'node:child_process'

let chromedriverProcess: ReturnType<typeof spawn> | undefined

async function waitForChromedriver(): Promise<void> {
  const timeoutMs = 10000
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch('http://127.0.0.1:9515/status')
      if (response.ok) {
        return
      }
    } catch {
      // Keep waiting until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error('chromedriver did not become ready within 10s')
}

export const config = {
  runner: 'local',
  hostname: '127.0.0.1',
  port: 9515,
  path: '/',
  specs: ['./features/**/*.feature'],
  maxInstances: 1,
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    requireModule: ['ts-node/register/transpile-only'],
    require: ['./features/step-definitions/**/*.ts'],
    timeout: 60000
  },
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        binary: '/usr/bin/chromium',
        args: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage']
      }
    }
  ],
  logLevel: 'error',
  onPrepare: async () => {
    chromedriverProcess = spawn('/usr/bin/chromedriver', ['--port=9515'], {
      stdio: 'inherit'
    })
    await waitForChromedriver()
  },
  onComplete: async () => {
    if (chromedriverProcess) {
      chromedriverProcess.kill('SIGTERM')
      chromedriverProcess = undefined
    }
  }
}
