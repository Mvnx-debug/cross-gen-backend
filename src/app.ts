import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { healthRoutes } from './modules/health/health.routes.js'
import { authRoutes } from './modules/auth/auth.routes'
import { usersRoutes } from './modules/users/users.routes.js'

export const app = new Elysia()
  .use(
    swagger({
      path: '/swagger',
    })
  )
  .group('/api', (app) =>
    app
      .use(healthRoutes)
      .use(authRoutes)
      .use(usersRoutes)
  )



