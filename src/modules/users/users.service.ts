import { auth } from '@/shared/auth'
import { usersRepository } from './users.repository'
import type { CreateUserDTO, UpdateUserDTO } from './users.types'
import type { UserRole } from '@/domain/user'

export class UsersService {
  async listUsersByBox(boxId: string) {
    const users = await usersRepository.findAllByBox(boxId)
    
    return {
      users,
      total: users.length,
    }
  }

  async getUserById(userId: string, requestingUserBoxId: string) {
    const user = await usersRepository.findById(userId)

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Verificar se o usuário pertence ao mesmo box
    if (user.boxId !== requestingUserBoxId) {
      throw new Error('Acesso negado: usuário de outro box')
    }

    return user
  }

  async createUser(data: CreateUserDTO & { boxId: string }) {
    // 1. Verificar email duplicado
    const existingUser = await usersRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    // 2. Validar role (não pode criar OWNER)
    // CORREÇÃO 1: Usar 'as UserRole' para permitir comparação
    if ((data.role as UserRole) === 'OWNER') {
      throw new Error('Não é permitido criar usuários com role OWNER')
    }

    let authUserId: string | null = null

    try {
      // 3. Criar no Better Auth
      const authUser = await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
        },
      })

      if (!authUser || !(authUser as any).user) {
        throw new Error('Falha ao criar autenticação')
      }

      authUserId = (authUser as any).user.id

      // 4. Criar no domínio
      // CORREÇÃO 2: Validar que authUserId não é null antes de passar
      if (!authUserId) {
        throw new Error('Falha ao obter ID do usuário autenticado')
      }

      const user = await usersRepository.create({
        authUserId, // Agora TypeScript sabe que não é null
        email: data.email,
        name: data.name,
        role: data.role,
        boxId: data.boxId,
      })

      return user
    } catch (error) {
      // Rollback
      if (authUserId) {
        try {
          // Better Auth não tem delete direto, mas podemos tentar
          // await auth.api.deleteUser({ userId: authUserId })
          console.error('Auth user criado mas falhou ao criar domínio:', authUserId)
        } catch (rollbackError) {
          console.error('Erro no rollback:', rollbackError)
        }
      }
      throw error
    }
  }

  async updateUser(userId: string, data: UpdateUserDTO, requestingUserBoxId: string) {
    // 1. Verificar se usuário existe
    const user = await usersRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // 2. Verificar se pertence ao mesmo box
    if (user.boxId !== requestingUserBoxId) {
      throw new Error('Acesso negado: usuário de outro box')
    }

    // 3. Não permitir alterar role para OWNER
    if (data.role === 'OWNER') {
      throw new Error('Não é permitido alterar role para OWNER')
    }

    // 4. Atualizar
    const updated = await usersRepository.update(userId, data)
    return updated
  }

  async deleteUser(userId: string, requestingUserBoxId: string, requestingUserRole: UserRole) {
    // 1. Verificar se usuário existe
    const user = await usersRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // 2. Verificar se pertence ao mesmo box
    if (user.boxId !== requestingUserBoxId) {
      throw new Error('Acesso negado: usuário de outro box')
    }

    // 3. Não permitir deletar OWNER
    if (user.role === 'OWNER') {
      throw new Error('Não é permitido deletar usuário OWNER')
    }

    // 4. Deletar
    await usersRepository.delete(userId)

    return { message: 'Usuário deletado com sucesso' }
  }

  async getUserStats(boxId: string) {
    const total = await usersRepository.countByBox(boxId)
    const coaches = await usersRepository.countByRole(boxId, 'COACH')
    const athletes = await usersRepository.countByRole(boxId, 'ATHLETE')

    return {
      total,
      coaches,
      athletes,
    }
  }
}

// Exportar instância singleton
export const usersService = new UsersService()