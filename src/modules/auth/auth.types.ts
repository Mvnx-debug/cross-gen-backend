import type { UserRole } from '@/domain/user'

export interface CreateOwnerDTO {
  email: string
  password: string
  name: string
  boxName: string
}

export interface SetupResponse {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  box: {
    id: string
    name: string
  }
  token: string
}

export interface AuthUser {
  id: string
  authUserId: string
  email: string
  name: string
  role: UserRole
  boxId: string | null
}
