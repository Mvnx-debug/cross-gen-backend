import { authService } from './auth.service'
import type { CreateOwnerDTO } from './auth.types'

export class AuthController {
  async setup(data: CreateOwnerDTO) {
    try {
      const isFirst = await authService.isFirstSetup()

      if (!isFirst) {
        return {
          status: 403,
          data: { error: 'Sistema já foi configurado' },
        }
      }

      const result = await authService.createOwnerWithBox(data)

      return {
        status: 201,
        data: result,
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          error: error instanceof Error ? error.message : 'Erro ao criar conta',
        },
      }
    }
  }

  async needSetup() {
    const needSetup = await authService.isFirstSetup()
    return {
      status: 200,
      data: { needSetup },
    }
  }
}

// Exportar instância singleton
export const authController = new AuthController()
