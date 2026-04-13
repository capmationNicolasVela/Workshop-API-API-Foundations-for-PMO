import Fastify, { FastifyInstance } from 'fastify'
import { registerSwagger } from './plugins/swagger'
import { registerJWT } from './plugins/jwt'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true })

  // ─── Plugins ──────────────────────────────────────────────────────────────
  registerSwagger(app)
  registerJWT(app)

  // ─── Routes ───────────────────────────────────────────────────────────────
  app.register(authRoutes, { prefix: '/auth' })
  app.register(userRoutes, { prefix: '/users' })

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))

  await app.ready()

  return app
}
