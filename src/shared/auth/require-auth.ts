import { Elysia } from 'elysia'
import { auth } from './better-auth'
import { db } from '@/shared/db'
import { users } from '@/shared/db/schema/users'
import { eq } from 'drizzle-orm'
import type { AuthSession } from './auth-types'

export const requireAuth = new Elysia({ name: 'require-auth' })
  .derive(async ({ request, set }) => {
    console.log('🔍 [requireAuth] Iniciando...')
    
    const session = (await auth.api.getSession({
      headers: request.headers,
    })) as AuthSession | null

    console.log('🔍 [requireAuth] Session:', session ? 'encontrada' : 'não encontrada')

    if (!session) {
      console.log('❌ [requireAuth] Sem sessão')
      set.status = 401
      throw new Error('Unauthorized')
    }

    console.log('🔍 [requireAuth] Buscando user com authUserId:', session.user.id)

    const user = await db.query.users.findFirst({
      where: eq(users.authUserId, session.user.id),
    })

    console.log('🔍 [requireAuth] User encontrado:', user ? 'sim' : 'não')

    if (!user) {
      console.log('❌ [requireAuth] User não encontrado no banco')
      set.status = 401
      throw new Error('User not found')
    }

    console.log('✅ [requireAuth] Sucesso! Role:', user.role)

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


/*
export async function requireAuth(request: Request){
    // valida sessão via better-auth
    const session = (await auth.api.getSession({
        headers: request.headers
    })) as AuthSession | null

    if(!session){
        throw new Error('Unauthorized')
    }
    // busca usuário no banco
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    })

    if(!user){
        throw new Error('User not found')   
    }
    // retorna contexto unificado
    return {
        auth: session.user,
        user: {
            id: user.id,
            boxId: user.boxId,
            role: user.role,
        },
    }

}*/