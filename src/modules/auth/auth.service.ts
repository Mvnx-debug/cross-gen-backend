import { db } from '@/shared/db'
import { user, account } from '@/shared/db/schema/auth'
import { users } from '@/shared/db/schema/users'
import { boxes } from '@/shared/db/schema/boxes'
import { auth } from '@/shared/auth'

export async function createOwnerWithBox(data: {
  email: string
  password: string
  name: string
  boxName: string
}) {
  // 1. Criar box
  const [box] = await db
    .insert(boxes)
    .values({
      name: data.boxName,
      address: 'Endereço padrão',
      phone: '(00) 00000-0000',
    })
    .returning()

  if (!box) {
    throw new Error('Falha ao criar box')
  }

  // 2. Criar usuário no Better Auth
  const authUser = await auth.api.signUpEmail({
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
    },
  })

  if (!authUser) {
    throw new Error('Falha ao criar usuário')
  }

  // 3. Criar registro na tabela users (domínio)
  const [domainUser] = await db
    .insert(users)
    .values({
      authUserId: (authUser as any).user.id,
      email: data.email,
      name: data.name,
      boxId: box.id,
      role: 'OWNER',
    })
    .returning()

  if (!domainUser) {
    throw new Error('Falha ao criar usuário do domínio')
  }

  return {
    user: domainUser,
    box,
    session: authUser,
  }
}
