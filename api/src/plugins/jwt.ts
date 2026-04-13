import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import jwtPlugin from '@fastify/jwt'
import { store } from '../store'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; role: string; jti: string }
    user: { userId: string; role: string; jti: string }
  }
}

export function registerJWT(app: FastifyInstance): void {
  app.register(jwtPlugin, {
    secret: process.env.JWT_SECRET ?? 'capmation-workshop-secret-change-this-in-production',
    sign: { expiresIn: '15m' }
  })
}

// ─── Middleware de autenticación ─────────────────────────────────────────────

/** Verifica JWT válido y que no haya sido revocado (logout) */
export async function authenticate(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await req.jwtVerify()
  } catch {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token inválido o expirado. Realizá login o usá /auth/refresh.'
    })
  }

  if (store.revokedTokens.has(req.user.jti)) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token revocado. La sesión fue cerrada.'
    })
  }
}

/** Verifica JWT válido, no revocado, y rol admin */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await req.jwtVerify()
  } catch {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token inválido o expirado.'
    })
  }

  if (store.revokedTokens.has(req.user.jti)) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token revocado. La sesión fue cerrada.'
    })
  }

  if (req.user.role !== 'admin') {
    return reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Esta acción requiere rol de administrador.'
    })
  }
}
