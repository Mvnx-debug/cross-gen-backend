import { auth } from '@/shared/auth'
import { authRepository } from './auth.repository'
import type { CreateOwnerDTO, SetupResponse } from './auth.types'

export class AuthService {
  async createOwnerWithBox(data: CreateOwnerDTO): Promise<SetupResponse> {
    let boxId: string | undefined
    let authUserId: string | undefined

    try {
      // 1. Verificar email duplicado
      const existingUser = await authRepository.findUserByEmail(data.email)
      if (existingUser) {
        throw new Error('Email já cadastrado')
      }

      // 2. Criar box
      const box = await authRepository.createBox(data.boxName)
      if (!box) {
        throw new Error('Falha ao criar box')
      }
      boxId = box.id

      // 3. Criar usuário no Better Auth
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
      
      const createdAuthUserId = (authUser as any).user.id
      authUserId = createdAuthUserId

      // 4. Criar usuário no domínio
      const domainUser = await authRepository.createDomainUser({
        authUserId: createdAuthUserId,
        email: data.email,
        name: data.name,
        boxId: box.id,
        role: 'OWNER',
      })

      if (!domainUser) {
        throw new Error('Falha ao criar usuário do domínio')
      }

      return {
        user: {
          id: domainUser.id,
          name: domainUser.name,
          email: domainUser.email,
          role: domainUser.role,
        },
        box: {
          id: box.id,
          name: box.name,
        },
        token: (authUser as any).token,
      }
    } catch (error) {
      // Rollback
      await this.rollbackSetup(boxId, authUserId)
      throw error
    }
  }

  async isFirstSetup(): Promise<boolean> {
    const owner = await authRepository.findFirstOwner()
    return !owner
  }

  async getUserByAuthId(authUserId: string) {
    return await authRepository.findUserByAuthId(authUserId)
  }

  private async rollbackSetup(boxId: string | undefined, authUserId: string | undefined) {
    if (boxId) {
      try {
        await authRepository.deleteBox(boxId)
      } catch (error) {
        console.error('Erro no rollback do box:', error)
      }
    }

    if (authUserId) {
      try {
        await authRepository.deleteAuthUser(authUserId)
      } catch (error) {
        console.error('Erro no rollback do auth user:', error)
      }
    }
  }
}

// Exportar instância singleton
export const authService = new AuthService()
