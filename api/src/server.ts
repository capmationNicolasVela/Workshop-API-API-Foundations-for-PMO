import { buildApp } from './app'

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || '0.0.0.0'

async function start(): Promise<void> {
  const app = await buildApp()

  try {
    await app.listen({ port: PORT, host: HOST })
    console.log(`\n📖  Swagger UI → http://localhost:${PORT}/docs\n`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
