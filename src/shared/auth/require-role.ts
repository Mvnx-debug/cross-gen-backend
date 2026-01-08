import { Elysia } from 'elysia'
import type { UserRole } from '@/domain/user'
import { auth } from './better-auth'
import { db } from '@/shared/db'
import { users } from '@/shared/db/schema/users'
import { eq } from 'drizzle-orm'
import type { AuthSession } from './auth-types'

export const requireAuth = new Elysia({ name: 'require-auth' })
  .derive(async ({ request, set }) => {
    const session = (await auth.api.getSession({
      headers: request.headers,
    })) as AuthSession | null

    if (!session) {
      set.status = 401
      throw new Error('Unauthorized')
    }

    const user = await db.query.users.findFirst({
      where: eq(users.authUserId, session.user.id),
    })

    if (!user) {
      set.status = 401
      throw new Error('User not found')
    }

    return {
      auth: session.user,
      user: {
        id: user.id,
        email: session.user.email,
        name: session.user.name,
        boxId: user.boxId,
        role: user.role,
      },
    }
  })

export const requireRole = (allowedRoles: UserRole[]) => 
  new Elysia({ name: 'require-role' })
    .use(requireAuth)
    .derive(({ user, set }: any) => {
      if (!allowedRoles.includes(user.role)) {
        set.status = 403
        throw new Error('Forbidden: insufficient permissions')
      }
      
      // retorna vazio porque não adiciona nada ao contexto
      // só valida e bloqueia se necessário
      return {}
    })