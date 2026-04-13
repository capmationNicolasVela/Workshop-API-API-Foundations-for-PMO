import { randomUUID } from 'crypto'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import { authenticate } from '../plugins/jwt'
import { store } from '../store'
import {
  LoginBody, LoginBodyType,
  RefreshBody, RefreshBodyType,
  LogoutBody, LogoutBodyType,
  AuthResponse, ErrorResponse
} from '../schemas/auth.schema'
import { UserResponse } from '../schemas/user.schema'
import { Type } from '@sinclair/typebox'

export async function authRoutes(app: FastifyInstance): Promise<void> {

  // ─── POST /auth/login ────────────────────────────────────────────────────
  app.post<{ Body: LoginBodyType }>('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Iniciar sesión',
      description: 'Autentica al usuario. Retorna un **access token JWT** (15 min) y un **refresh token** (7 días).\n\nGuardar ambos tokens: el access token se envía en cada request autenticado; el refresh token se usa para renovar la sesión.',
      body: LoginBody,
      response: {
        200: AuthResponse,
        401: ErrorResponse
      }
    }
  }, async (req, reply) => {
    const { username, password } = req.body

    const user = store.users.findByUsername(username)
    if (!user || !store.users.verifyPassword(user, password)) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Credenciales inválidas.'
      })
    }

    const accessToken = app.jwt.sign({ userId: user.id, role: user.role, jti: randomUUID() })
    const refreshToken = store.refreshTokens.create(user.id)

    return reply.code(200).send({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    })
  })

  // ─── POST /auth/refresh ──────────────────────────────────────────────────
  app.post<{ Body: RefreshBodyType }>('/refresh', {
    schema: {
      tags: ['Auth'],
      summary: 'Renovar tokens (token rotation)',
      description: 'Intercambia el refresh token por un **nuevo access token** y un **nuevo refresh token**.\n\nEl refresh token anterior queda **revocado de inmediato** — este es el estándar de *token rotation*. Si alguien roba un refresh token ya usado, el servidor puede detectar el intento de reutilización.',
      body: RefreshBody,
      response: {
        200: AuthResponse,
        401: ErrorResponse
      }
    }
  }, async (req, reply) => {
    const { refreshToken } = req.body

    const result = store.refreshTokens.rotate(refreshToken)
    if (!result) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Refresh token inválido o expirado. Realizá login nuevamente.'
      })
    }

    const user = store.users.findById(result.userId)
    if (!user) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Usuario no encontrado.'
      })
    }

    const accessToken = app.jwt.sign({ userId: user.id, role: user.role, jti: randomUUID() })

    return reply.code(200).send({
      accessToken,
      refreshToken: result.newToken,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    })
  })

  // ─── POST /auth/logout ───────────────────────────────────────────────────
  app.post<{ Body: LogoutBodyType }>('/logout', {
    schema: {
      tags: ['Auth'],
      summary: 'Cerrar sesión',
      description: 'Revoca el refresh token en el servidor. El access token sigue siendo válido hasta que expire (máx. 15 min).\n\nEn producción, para revocación inmediata del access token se puede usar una blocklist en Redis.',
      security: [{ bearerAuth: [] }],
      body: LogoutBody,
      response: {
        200: Type.Object({ message: Type.String() }),
        401: ErrorResponse
      }
    },
    preHandler: authenticate
  }, async (req: FastifyRequest<{ Body: LogoutBodyType }>, reply) => {
    store.revokedTokens.add(req.user.jti)
    store.refreshTokens.revoke(req.body.refreshToken)
    return reply.code(200).send({ message: 'Sesión cerrada correctamente.' })
  })

  // ─── GET /auth/me ────────────────────────────────────────────────────────
  app.get('/me', {
    schema: {
      tags: ['Auth'],
      summary: 'Perfil del usuario autenticado',
      description: 'Retorna los datos del usuario identificado por el access token.',
      security: [{ bearerAuth: [] }],
      response: {
        200: UserResponse,
        401: ErrorResponse
      }
    },
    preHandler: authenticate
  }, async (req: FastifyRequest, reply) => {
    const user = store.users.findById(req.user.userId)
    if (!user) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Usuario no encontrado.'
      })
    }
    const { passwordHash: _omit, ...publicUser } = user
    return reply.code(200).send(publicUser)
  })
}
