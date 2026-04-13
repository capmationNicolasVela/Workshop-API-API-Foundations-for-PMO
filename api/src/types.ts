export type Role = 'admin' | 'client'

export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  role: Role
  createdAt: string
}

export type PublicUser = Omit<User, 'passwordHash'>

export interface RefreshTokenRecord {
  token: string
  userId: string
  expiresAt: Date
}
