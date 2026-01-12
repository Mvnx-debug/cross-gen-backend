import { Elysia } from 'elysia'
import type { UserRole } from '@/domain/user'
import { auth } from './better-auth'
import { authService } from '@/modules/auth/auth.service'
import type { AuthSession, AuthUser } from '@/shared/types/context'

// Função helper para autenticar
export async function authenticateUser(request: Request) {
  // Tentar pegar sessão do Better Auth
  let session = (await auth.api.getSession({
    headers: request.headers,
  })) as AuthSession | null

  // Se não encontrar sessão via cookie, tentar via Bearer token
  if (!session) {
    const authHeader = request.headers.get('authorization')
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      // Criar headers com o token como cookie para Better Auth
      const headersWithToken = new Headers(request.headers)
      headersWithToken.set('cookie', `better-auth.session_token=${token}`)
      
      session = (await auth.api.getSession({
        headers: headersWithToken,
      })) as AuthSession | null
    }
  }

  if (!session) {
    throw new Error('Unauthorized')
  }
  
  const user = await authService.getUserByAuthId(session.user.id)

  if (!user) {
    throw new Error('User not found')
  }

  const authUser = {
    id: user.id,
    email: session.user.email,
    name: session.user.name,
    boxId: user.boxId,
    role: user.role,
  } as AuthUser

  return {
    auth: session.user,
    user: authUser,
  }
}

export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .derive(async ({ request, set }) => {
    try {
      return await authenticateUser(request)
    } catch (error) {
      set.status = 401
      throw error
    }
  })

export const requireAuth = authMiddleware

export const requireRole = (allowedRoles: UserRole[]) =>
  new Elysia()
    .use(authMiddleware)
    .guard({
      beforeHandle: (context) => {
        const { user, set } = context as any as { user: AuthUser; set: any }

        if (!allowedRoles.includes(user.role)) {
          set.status = 403
          throw new Error('Forbidden: insufficient permissions')
        }
      },
    })
