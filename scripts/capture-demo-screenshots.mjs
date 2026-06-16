// Captures the public demo screenshots used in the README walkthrough.
//
// One-off dev utility — Playwright is NOT a project dependency. To run:
//   npm run build
//   npm i -D playwright && npx playwright install chromium
//   node scripts/capture-demo-screenshots.mjs
//   npm uninstall playwright
//
// Images are written to docs/screenshots/.

import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const port = Number(process.env.PORT || 3210)
const baseUrl = `http://127.0.0.1:${port}`
const outDir = 'docs/screenshots'
const viewport = { width: 1440, height: 900 }

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer() {
  const startedAt = Date.now()
  while (Date.now() - startedAt < 30_000) {
    try {
      const res = await fetch(`${baseUrl}/demo`)
      if (res.ok) return
    } catch {
      // still booting
    }
    await wait(500)
  }
  throw new Error(`Server did not become ready at ${baseUrl}`)
}

const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)],
  {
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key',
    },
    stdio: ['ignore', 'ignore', 'inherit'],
  }
)

let exitCode = 0

try {
  await waitForServer()
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 })

  const shoot = async (name) => {
    await page.screenshot({ path: `${outDir}/${name}.png` })
    console.log(`saved ${outDir}/${name}.png`)
  }

  // 1 — Dashboard (default view)
  await page.goto(`${baseUrl}/demo`, { waitUntil: 'networkidle' })
  await shoot('demo-dashboard')

  // 2 — Leads detail
  await page.getByRole('button', { name: 'Leads', exact: true }).click()
  await wait(250)
  await shoot('demo-leads')

  // 3 — Clients detail
  await page.getByRole('button', { name: 'Clients', exact: true }).click()
  await wait(250)
  await shoot('demo-clients')

  // 4 — Guided tour (step 1)
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Take the tour' }).click()
  await wait(500)
  await shoot('demo-tour')

  await browser.close()
  console.log('Screenshots captured')
} catch (error) {
  exitCode = 1
  console.error(error)
} finally {
  server.kill('SIGTERM')
  await Promise.race([
    new Promise((resolve) => server.once('close', resolve)),
    wait(2_000),
  ])
  process.exit(exitCode)
}
