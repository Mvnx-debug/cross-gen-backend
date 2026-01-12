import { usersService } from './users.service'
import type { CreateUserDTO, UpdateUserDTO } from './users.types'
import type { AuthUser } from '@/shared/types/context'

export class UsersController {
  async listUsers(user: AuthUser) {
    try {
      if (!user.boxId) {
        return {
          status: 403,
          data: { error: 'Usuário não possui box associado' },
        }
      }

      const result = await usersService.listUsersByBox(user.boxId)

      return {
        status: 200,
        data: result,
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          error: error instanceof Error ? error.message : 'Erro ao listar usuários',
        },
      }
    }
  }

  async getUser(userId: string, user: AuthUser) {
    try {
      if (!user.boxId) {
        return {
          status: 403,
          data: { error: 'Usuário não possui box associado' },
        }
      }

      const result = await usersService.getUserById(userId, user.boxId)

      return {
        status: 200,
        data: result,
      }
    } catch (error) {
      return {
        status: 404,
        data: {
          error: error instanceof Error ? error.message : 'Usuário não encontrado',
        },
      }
    }
  }

  async createUser(data: CreateUserDTO, user: AuthUser) {
    try {
      if (!user.boxId) {
        return {
          status: 403,
          data: { error: 'Usuário não possui box associado' },
        }
      }

      const result = await usersService.createUser({
        ...data,
        boxId: user.boxId,
      })

      return {
        status: 201,
        data: result,
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          error: error instanceof Error ? error.message : 'Erro ao criar usuário',
        },
      }
    }
  }

  async updateUser(userId: string, data: UpdateUserDTO, user: AuthUser) {
    try {
      if (!user.boxId) {
        return {
          status: 403,
          data: { error: 'Usuário não possui box associado' },
        }
      }

      const result = await usersService.updateUser(userId, data, user.boxId)

      return {
        status: 200,
        data: result,
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          error: error instanceof Error ? error.message : 'Erro ao atualizar usuário',
        },
      }
    }
  }

  async deleteUser(userId: string, user: AuthUser) {
    try {
      if (!user.boxId) {
        return {
          status: 403,
          data: { error: 'Usuário não possui box associado' },
        }
      }

      const result = await usersService.deleteUser(userId, user.boxId, user.role)

      return {
        status: 200,
        data: result,
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          error: error instanceof Error ? error.message : 'Erro ao deletar usuário',
        },
      }
    }
  }

  async getUserStats(user: AuthUser) {
    try {
      if (!user.boxId) {
        return {
          status: 403,
          data: { error: 'Usuário não possui box associado' },
        }
      }

      const result = await usersService.getUserStats(user.boxId)

      return {
        status: 200,
        data: result,
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas',
        },
      }
    }
  }
}

// Exportar instância singleton
export const usersController = new UsersController()