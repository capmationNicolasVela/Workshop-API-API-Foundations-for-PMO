import { createHash, randomBytes } from 'crypto'
import type { User, RefreshTokenRecord, Role } from '../types'

// ─── Config ──────────────────────────────────────────────────────────────────
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000  // 7 días
const HASH_SALT = 'capmation-workshop-salt'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hashPassword(password: string): string {
  return createHash('sha256').update(`${password}:${HASH_SALT}`).digest('hex')
}

// ─── Seed data ───────────────────────────────────────────────────────────────
// Credenciales de prueba:
//   admin    / Admin123!   → rol: admin
//   usuario1 / Client123!  → rol: client
const usersMap = new Map<string, User>([
  ['1', {
    id: '1',
    username: 'admin',
    email: 'admin@capmation.com',
    passwordHash: hashPassword('Admin123!'),
    role: 'admin',
    createdAt: '2026-04-01T00:00:00.000Z'
  }],
  ['2', {
    id: '2',
    username: 'usuario1',
    email: 'usuario1@capmation.com',
    passwordHash: hashPassword('Client123!'),
    role: 'client',
    createdAt: '2026-04-01T00:00:00.000Z'
  }]
])

const refreshTokensMap = new Map<string, RefreshTokenRecord>()
const revokedJtis = new Set<string>()   // blocklist de access tokens revocados
let nextId = 3

// ─── Store ───────────────────────────────────────────────────────────────────
export const store = {
  users: {
    findById(id: string): User | undefined {
      return usersMap.get(id)
    },

    findByUsername(username: string): User | undefined {
      return [...usersMap.values()].find(u => u.username === username)
    },

    findByEmail(email: string): User | undefined {
      return [...usersMap.values()].find(u => u.email === email)
    },

    list(): User[] {
      return [...usersMap.values()]
    },

    create(data: { username: string; email: string; password: string; role: Role }): User {
      const id = String(nextId++)
      const user: User = {
        id,
        username: data.username,
        email: data.email,
        passwordHash: hashPassword(data.password),
        role: data.role,
        createdAt: new Date().toISOString()
      }
      usersMap.set(id, user)
      return user
    },

    update(
      id: string,
      data: Partial<{ username: string; email: string; password: string; role: Role }>
    ): User | null {
      const user = usersMap.get(id)
      if (!user) return null
      const updated: User = {
        ...user,
        ...(data.username !== undefined && { username: data.username }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.password !== undefined && { passwordHash: hashPassword(data.password) })
      }
      usersMap.set(id, updated)
      return updated
    },

    verifyPassword(user: User, password: string): boolean {
      return user.passwordHash === hashPassword(password)
    }
  },

  refreshTokens: {
    create(userId: string): string {
      const token = randomBytes(40).toString('hex')
      refreshTokensMap.set(token, {
        token,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
      })
      return token
    },

    // Token rotation: invalida el token anterior y emite uno nuevo.
    // Si el token ya expiró o no existe, retorna null (posible reutilización → atacante).
    rotate(oldToken: string): { newToken: string; userId: string } | null {
      const record = refreshTokensMap.get(oldToken)
      if (!record) return null
      if (record.expiresAt < new Date()) {
        refreshTokensMap.delete(oldToken)
        return null
      }
      refreshTokensMap.delete(oldToken)
      const newToken = this.create(record.userId)
      return { newToken, userId: record.userId }
    },

    revoke(token: string): void {
      refreshTokensMap.delete(token)
    }
  },

  revokedTokens: {
    add(jti: string): void {
      revokedJtis.add(jti)
    },
    has(jti: string): boolean {
      return revokedJtis.has(jti)
    }
  }
}
