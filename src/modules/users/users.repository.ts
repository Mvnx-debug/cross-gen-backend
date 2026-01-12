import { db } from '@/shared/db'
import { users } from '@/shared/db/schema/users'
import { eq, and } from 'drizzle-orm'
import type { UserRole } from '@/domain/user'

export class UsersRepository {
  // Listagem
  async findAllByBox(boxId: string) {
    return await db.query.users.findMany({
      where: eq(users.boxId, boxId),
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        boxId: true,
        createdAt: true,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    })
  }

  async findById(userId: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        box: true,
      },
    })
  }

  async findByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }

  async findByAuthId(authUserId: string) {
    return await db.query.users.findFirst({
      where: eq(users.authUserId, authUserId),
      with: {
        box: true,
      },
    })
  }

  // Criação
  async create(data: {
    authUserId: string
    email: string
    name: string
    role: UserRole
    boxId: string
  }) {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning()

    return user
  }

  // Atualização
  async update(userId: string, data: {
    name?: string
    role?: UserRole
  }) {
    const [updated] = await db
      .update(users)
      .set(data) 
      .where(eq(users.id, userId))
      .returning()

    return updated
  }

  // Deleção
  async delete(userId: string) {
    await db.delete(users).where(eq(users.id, userId))
  }

  // Estatísticas
  async countByBox(boxId: string) {
    const result = await db.query.users.findMany({
      where: eq(users.boxId, boxId),
    })
    return result.length
  }

  async countByRole(boxId: string, role: UserRole) {
    const result = await db.query.users.findMany({
      where: and(
        eq(users.boxId, boxId),
        eq(users.role, role)
      ),
    })
    return result.length
  }
}

// Exportar instância singleton
export const usersRepository = new UsersRepository()