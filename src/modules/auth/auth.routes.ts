import { Elysia } from 'elysia'
import { authController } from './auth.controller'
import { setupSchema } from './auth.validators'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/setup', async ({ body, set }) => {
    const result = await authController.setup(body)
    set.status = result.status
    return result.data
  }, {
    body: setupSchema,
  })

  .get('/need-setup', async ({ set }) => {
    const result = await authController.needSetup()
    set.status = result.status
    return result.data
  })
