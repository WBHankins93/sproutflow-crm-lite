import { spawn } from 'node:child_process'

const port = Number(process.env.PORT || 3100)
const baseUrl = `http://127.0.0.1:${port}`
const timeoutMs = 30_000

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer() {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/demo`)
      if (response.ok) return
    } catch {
      // The server is still booting.
    }
    await wait(500)
  }

  throw new Error(`Server did not become ready at ${baseUrl}`)
}

async function expectHtml(path, expectedText) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' })
  const body = await response.text()

  if (response.status !== 200) {
    throw new Error(`${path} returned ${response.status}, expected 200`)
  }

  if (!body.includes(expectedText)) {
    throw new Error(`${path} did not include expected text: ${expectedText}`)
  }
}

async function expectRedirect(path, location) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' })

  if (![307, 308].includes(response.status)) {
    throw new Error(`${path} returned ${response.status}, expected a temporary redirect`)
  }

  const actualLocation = response.headers.get('location')
  if (actualLocation !== location) {
    throw new Error(`${path} redirected to ${actualLocation}, expected ${location}`)
  }
}

const server = spawn('npm', ['run', 'start', '--', '--hostname', '127.0.0.1', '--port', String(port)], {
  env: {
    ...process.env,
    PORT: String(port),
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

server.stdout.on('data', (chunk) => process.stdout.write(chunk))
server.stderr.on('data', (chunk) => process.stderr.write(chunk))

try {
  await waitForServer()
  await expectHtml('/demo', 'Demo Workspace')
  await expectHtml('/demo', 'Maya Brooks')
  await expectHtml('/login', 'Welcome back')
  await expectRedirect('/', '/login')
  await expectRedirect('/dashboard', '/login')
  await expectRedirect('/leads', '/login')
  await expectRedirect('/clients', '/login')
  await expectRedirect('/settings', '/login')
  console.log('Smoke tests passed')
} finally {
  server.kill('SIGTERM')
}
