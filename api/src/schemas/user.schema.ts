import { Type, Static } from '@sinclair/typebox'

export const RoleEnum = Type.Union([
  Type.Literal('admin'),
  Type.Literal('client')
])

export const UserResponse = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String(),
  role: RoleEnum,
  createdAt: Type.String({ format: 'date-time' })
})

export const CreateUserBody = Type.Object({
  username: Type.String({
    minLength: 3,
    maxLength: 30,
    description: 'Nombre de usuario único',
    examples: ['nuevo_usuario']
  }),
  email: Type.String({
    format: 'email',
    description: 'Correo electrónico único',
    examples: ['nuevo@capmation.com']
  }),
  password: Type.String({
    minLength: 8,
    description: 'Contraseña (mínimo 8 caracteres)',
    examples: ['Segura123!']
  }),
  role: RoleEnum
})

export const UpdateUserBody = Type.Object({
  username: Type.Optional(Type.String({ minLength: 3, maxLength: 30 })),
  email: Type.Optional(Type.String({ format: 'email' })),
  password: Type.Optional(Type.String({ minLength: 8 })),
  role: Type.Optional(RoleEnum)
})

export const IdParams = Type.Object({
  id: Type.String({ description: 'ID del usuario' })
})

export const UsernameParams = Type.Object({
  username: Type.String({ description: 'Nombre de usuario' })
})

export const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String()
})

export type CreateUserBodyType = Static<typeof CreateUserBody>
export type UpdateUserBodyType = Static<typeof UpdateUserBody>
