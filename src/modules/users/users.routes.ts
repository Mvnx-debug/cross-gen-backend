import { Elysia } from 'elysia'
import { requireAuth, requireRole } from '@/shared/auth'

export const usersRoutes = new Elysia({ prefix: '/users'})
    .use(requireAuth)
    .get('/me', ({ user }: any) => ({
        id: user.id,
        email: user.email,
        role: user.role,
    }))

    //rota Somente Owners
    .use(requireRole(['OWNER']))
    .get('/', () => ({
        message: 'Lista de todos os usuários (somente para owners)',
        users: [], //conectar com o service depois
    }))