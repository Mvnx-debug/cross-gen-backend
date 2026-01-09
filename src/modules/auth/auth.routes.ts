import { Elysia, t } from 'elysia'
import { auth } from '@/shared/auth'
import { createOwnerWithBox } from './auth.service'

export const authRoutes = new Elysia({ prefix: '/auth' })
    .post('/setup', async ({ body, set }) => {
        try {
            const result = await createOwnerWithBox({
                email: body.email,
                password: body.password,
                name: body.name,
                boxName: body.boxName,
            })
            
            return {
                message: 'Owner e Box criados com sucesso!',
                user: result.user,
                box: result.box,
            }
        } catch (error) {
            set.status = 400
            return {
                error: error instanceof Error ? error.message : 'Erro ao criar owner',
            }
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
            name: t.String(),
            boxName: t.String(),
        }),
    })
    .all('/*', ({ request }) => auth.handler(request))