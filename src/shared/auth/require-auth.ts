import { db } from '@/shared/db'
import { users } from '@/shared/db/schema/users'
import { eq } from 'drizzle-orm'
import type { AuthSession } from './auth-types'
import { auth } from './better-auth'

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

}