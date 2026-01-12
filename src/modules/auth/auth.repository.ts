import { db } from '@/shared/db'
import { user } from '@/shared/db/schema/auth'
import { users } from '@/shared/db/schema/users'
import { boxes } from '@/shared/db/schema/boxes'
import { eq } from 'drizzle-orm'
import type { UserRole } from '@/domain/user'

export class AuthRepository {
  // Verificações
  async findUserByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }

  async findUserByAuthId(authUserId: string) {
    return await db.query.users.findFirst({
      where: eq(users.authUserId, authUserId),
      with: {
        box: true,
      },
    })
  }

  async findFirstOwner() {
    return await db.query.users.findFirst({
      where: eq(users.role, 'OWNER'),
    })
  }

  // Criação
  async createBox(name: string) {
    const [box] = await db
      .insert(boxes)
      .values({
        name,
        address: '',
        phone: '',
      })
      .returning()

    return box
  }

  async createDomainUser(data: {
    authUserId: string
    email: string
    name: string
    boxId: string
    role: UserRole
  }) {
    const [domainUser] = await db
      .insert(users)
      .values(data)
      .returning()

    return domainUser
  }

  // Deleção (para rollback)
  async deleteBox(boxId: string) {
    await db.delete(boxes).where(eq(boxes.id, boxId))
  }

  async deleteAuthUser(authUserId: string) {
    await db.delete(user).where(eq(user.id, authUserId))
  }

  async deleteDomainUser(userId: string) {
    await db.delete(users).where(eq(users.id, userId))
  }
}

// Exportar instância singleton
export const authRepository = new AuthRepository()
