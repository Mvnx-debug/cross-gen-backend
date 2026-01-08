import { Elysia } from 'elysia'
import type { UserRole } from '@/domain/user'
import { requireAuth } from './require-auth'

export const requireRole = (allowedRoles: UserRole[]) => 
  new Elysia({ name: 'require-role' })
    .use(requireAuth)
    .derive(({ user, set }: any) => {
      if (!allowedRoles.includes(user.role)) {
        set.status = 403
        throw new Error('Forbidden: insufficient permissions')
      }
      
      return {}
    })