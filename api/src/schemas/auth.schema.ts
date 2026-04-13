import { Type, Static } from '@sinclair/typebox'

export const LoginBody = Type.Object({
  username: Type.String({ minLength: 1, description: 'Nombre de usuario', examples: ['admin'] }),
  password: Type.String({ minLength: 1, description: 'Contraseña', examples: ['Admin123!'] })
})

export const RefreshBody = Type.Object({
  refreshToken: Type.String({
    description: 'Refresh token obtenido en /auth/login o en un refresh previo'
  })
})

export const LogoutBody = Type.Object({
  refreshToken: Type.String({
    description: 'Refresh token a revocar'
  })
})

export const PublicUserSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String(),
  role: Type.Union([Type.Literal('admin'), Type.Literal('client')])
})

export const AuthResponse = Type.Object({
  accessToken: Type.String({
    description: 'JWT firmado — expira en 15 minutos. Enviar en header: Authorization: Bearer <token>'
  }),
  refreshToken: Type.String({
    description: 'Token opaco — expira en 7 días. Guardar de forma segura. Se rota en cada uso.'
  }),
  user: PublicUserSchema
})

export const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String()
})

export type LoginBodyType = Static<typeof LoginBody>
export type RefreshBodyType = Static<typeof RefreshBody>
export type LogoutBodyType = Static<typeof LogoutBody>
