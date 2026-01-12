import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { auth } from '@/shared/auth'

import { healthRoutes } from './modules/health/health.routes.js'
import { authRoutes } from './modules/auth/auth.routes'
import { usersRoutes } from './modules/users/users.routes'

export const app = new Elysia()
  .use(cors({
    origin: true,
    credentials: true,
  }))
  .use(
    swagger({
      path: '/swagger',
      documentation: {
        info: {
          title: 'CrossGen Backend API',
          version: '1.0.0',
          description: 'API para gerenciamento de Box de CrossFit'
        },
        tags: [
          { name: 'Health', description: 'Health check endpoints' },
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Users', description: 'User management endpoints' }
        ]
      }
    })
  )
  // Expor Better Auth handler (necessário para login, logout, etc)
  .all('/api/auth/*', ({ request }) => auth.handler(request))
  
  .group('/api', (app) =>
    app
      .use(healthRoutes)
      .use(authRoutes)
      .use(usersRoutes)
  )



