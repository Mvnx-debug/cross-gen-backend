import { Elysia } from 'elysia'
import { authMiddleware, requireRole } from '@/shared/auth/require-role'
import type { AuthUser } from '@/shared/types/context'

export const usersRoutes = new Elysia({ prefix: '/users' })
  .use(authMiddleware)
  .get('/me', (context) => {
    const { user, auth } = context as any as { user: AuthUser; auth: any }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      boxId: user.boxId,
      emailVerified: auth.emailVerified,
    }
  })
  .use(requireRole(['OWNER', 'COACH']))
  .get('/list', (context) => {
    const { user } = context as any as { user: AuthUser }
    
    // TODO: Implementar listagem de usuários do box
    return {
      message: 'Lista de usuários',
      boxId: user.boxId,
    }
  })
  .use(requireRole(['OWNER']))
  .get('/admin', (context) => {
    const { user } = context as any as { user: AuthUser }
    
    return {
      message: 'Área administrativa - Apenas OWNER',
      user: user.name,
      role: user.role,
      boxId: user.boxId,
    }
  })
