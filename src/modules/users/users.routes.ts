import { Elysia } from 'elysia'
import { authenticateUser, requireRole } from '@/shared/auth/require-role'
import type { AuthUser } from '@/shared/types/context'
import { usersController } from './users.controller'
import { createUserSchema, updateUserSchema, userIdSchema } from './users.validators'

export const usersRoutes = new Elysia({ prefix: '/users' })
  // Rota pública (apenas autenticado)
  .get('/me', async ({ request, set }: any) => {
    try {
      const { user, auth } = await authenticateUser(request)
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        boxId: user.boxId,
        emailVerified: auth?.emailVerified || false,
      }
    } catch (error) {
      set.status = 401
      throw error
    }
  })
  
  // Rotas para OWNER e COACH
  .use(requireRole(['OWNER', 'COACH']))
  
  .get('/', async ({ user, set }: any) => {
    const result = await usersController.listUsers(user as AuthUser)
    set.status = result.status
    return result.data
  })
  
  .get('/stats', async ({ user, set }: any) => {
    const result = await usersController.getUserStats(user as AuthUser)
    set.status = result.status
    return result.data
  })
  
  .get('/:id', async ({ params, user, set }: any) => {
    const result = await usersController.getUser(params.id, user as AuthUser)
    set.status = result.status
    return result.data
  }, {
    params: userIdSchema,
  })
  
  // Rotas exclusivas de OWNER
  .use(requireRole(['OWNER']))
  
  .post('/', async ({ body, user, set }: any) => {
    const result = await usersController.createUser(body, user as AuthUser)
    set.status = result.status
    return result.data
  }, {
    body: createUserSchema,
  })
  
  .patch('/:id', async ({ params, body, user, set }: any) => {
    const result = await usersController.updateUser(params.id, body, user as AuthUser)
    set.status = result.status
    return result.data
  }, {
    params: userIdSchema,
    body: updateUserSchema,
  })
  
  .delete('/:id', async ({ params, user, set }: any) => {
    const result = await usersController.deleteUser(params.id, user as AuthUser)
    set.status = result.status
    return result.data
  }, {
    params: userIdSchema,
  })
