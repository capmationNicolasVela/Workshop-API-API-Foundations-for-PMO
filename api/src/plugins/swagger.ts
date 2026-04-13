import type { FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

export function registerSwagger(app: FastifyInstance): void {
  app.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Capmation Workshop API',
        description: `
## API Foundations for PMO — Workshop API

API de referencia construida con **Fastify + TypeScript** para el taller de Capmation.

---

### Credenciales de prueba

| Usuario   | Contraseña  | Rol    |
|-----------|-------------|--------|
| admin     | Admin123!   | admin  |
| usuario1  | Client123!  | client |

---

### Flujo de autenticación

\`\`\`
1. POST /auth/login         → accessToken (15 min) + refreshToken (7 días)
2. GET  /auth/me            → Authorization: Bearer <accessToken>
3. POST /auth/refresh       → nuevos tokens (refreshToken anterior revocado)
4. POST /auth/logout        → revoca refreshToken
\`\`\`

El \`accessToken\` se envía en el header \`Authorization: Bearer <token>\` en todas las rutas protegidas.
        `.trim(),
        version: '1.0.0',
        contact: { name: 'Capmation', email: 'hola@capmation.com' }
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Access token JWT obtenido en POST /auth/login'
          }
        }
      },
      tags: [
        { name: 'Auth', description: 'Autenticación y gestión de sesión' },
        { name: 'Users', description: 'Gestión de usuarios' }
      ]
    }
  })

  app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true
    }
  })
}
