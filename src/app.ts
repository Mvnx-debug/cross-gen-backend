import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { healthRoutes } from './modules/health/health.routes.js'

export const app = new Elysia()
  .use(
    swagger({
      path: '/swagger',
    })
  )
  .group('/api', (app) =>
    app.use(healthRoutes)
  )
