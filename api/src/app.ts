import Fastify, { FastifyInstance } from 'fastify'
import { registerSwagger } from './plugins/swagger'
import { registerJWT } from './plugins/jwt'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'
import { Type } from '@sinclair/typebox'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true })

  // ─── Plugins ──────────────────────────────────────────────────────────────
  registerSwagger(app)
  registerJWT(app)

  // ─── Routes ───────────────────────────────────────────────────────────────
  app.register(authRoutes, { prefix: '/auth' })
  app.register(userRoutes, { prefix: '/users' })

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get('/health', {
    schema: {
      summary: 'Health check',
      description: 'Verifica que el servidor está activo.',
      response: {
        200: Type.Object({
          status: Type.String(),
          timestamp: Type.String({ format: 'date-time' }),
          uptime: Type.Number({ description: 'Segundos desde que inició el servidor' })
        })
      }
    }
  }, async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }))

  return app
}
