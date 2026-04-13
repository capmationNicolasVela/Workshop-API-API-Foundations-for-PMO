import type { FastifyInstance, FastifyRequest } from 'fastify'
import { authenticate, requireAdmin } from '../plugins/jwt'
import { store } from '../store'
import {
  CreateUserBody, CreateUserBodyType,
  UpdateUserBody, UpdateUserBodyType,
  UserResponse, ErrorResponse,
  IdParams, UsernameParams
} from '../schemas/user.schema'
import { Type } from '@sinclair/typebox'

export async function userRoutes(app: FastifyInstance): Promise<void> {

  // ─── POST /users — solo admin ────────────────────────────────────────────
  app.post<{ Body: CreateUserBodyType }>('/', {
    schema: {
      tags: ['Users'],
      summary: 'Crear usuario',
      description: 'Crea un nuevo usuario con el rol especificado. **Solo administradores.**\n\nLos roles disponibles son `admin` y `client`.',
      security: [{ bearerAuth: [] }],
      body: CreateUserBody,
      response: {
        201: UserResponse,
        400: ErrorResponse,
        401: ErrorResponse,
        403: ErrorResponse
      }
    },
    preHandler: requireAdmin
  }, async (req, reply) => {
    const { username, email, password, role } = req.body

    if (store.users.findByUsername(username)) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: `El username '${username}' ya está en uso.`
      })
    }
    if (store.users.findByEmail(email)) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: `El email '${email}' ya está registrado.`
      })
    }

    const user = store.users.create({ username, email, password, role })
    const { passwordHash: _omit, ...publicUser } = user
    return reply.code(201).send(publicUser)
  })

  // ─── GET /users — solo admin ─────────────────────────────────────────────
  app.get('/', {
    schema: {
      tags: ['Users'],
      summary: 'Listar todos los usuarios',
      description: 'Retorna la lista completa de usuarios registrados. **Solo administradores.**',
      security: [{ bearerAuth: [] }],
      response: {
        200: Type.Array(UserResponse),
        401: ErrorResponse,
        403: ErrorResponse
      }
    },
    preHandler: requireAdmin
  }, async (_req, reply) => {
    const users = store.users.list().map(({ passwordHash: _omit, ...u }) => u)
    return reply.code(200).send(users)
  })

  // ─── GET /users/by-username/:username — autenticado ─────────────────────
  // Nota: esta ruta debe registrarse ANTES de /:id para que Fastify
  // no interprete "by-username" como un id dinámico.
  app.get<{ Params: { username: string } }>('/by-username/:username', {
    schema: {
      tags: ['Users'],
      summary: 'Buscar usuario por username',
      description: 'Retorna los datos públicos de un usuario buscando por su nombre de usuario.',
      security: [{ bearerAuth: [] }],
      params: UsernameParams,
      response: {
        200: UserResponse,
        401: ErrorResponse,
        404: ErrorResponse
      }
    },
    preHandler: authenticate
  }, async (req, reply) => {
    const { username } = req.params
    const user = store.users.findByUsername(username)
    if (!user) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: `No existe un usuario con username '${username}'.`
      })
    }
    const { passwordHash: _omit, ...publicUser } = user
    return reply.code(200).send(publicUser)
  })

  // ─── PATCH /users/:id — admin o el propio usuario ────────────────────────
  app.patch<{ Params: { id: string }; Body: UpdateUserBodyType }>('/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Actualizar usuario',
      description: 'Actualiza los datos de un usuario.\n\n- **Admin**: puede actualizar cualquier usuario, incluyendo el rol.\n- **Client**: solo puede actualizar su propio perfil y no puede cambiar su rol.',
      security: [{ bearerAuth: [] }],
      params: IdParams,
      body: UpdateUserBody,
      response: {
        200: UserResponse,
        400: ErrorResponse,
        401: ErrorResponse,
        403: ErrorResponse,
        404: ErrorResponse
      }
    },
    preHandler: authenticate
  }, async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserBodyType }>, reply) => {
    const { id } = req.params
    const { userId, role } = req.user

    // Un client solo puede editar su propio perfil
    if (role !== 'admin' && userId !== id) {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Solo podés actualizar tu propio perfil.'
      })
    }

    // Un client no puede cambiar su propio rol
    if (role !== 'admin' && req.body.role !== undefined) {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'No tenés permiso para cambiar el rol.'
      })
    }

    const updated = store.users.update(id, req.body)
    if (!updated) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: `No existe un usuario con id '${id}'.`
      })
    }

    const { passwordHash: _omit, ...publicUser } = updated
    return reply.code(200).send(publicUser)
  })
}
