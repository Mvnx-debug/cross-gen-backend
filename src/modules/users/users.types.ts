import { UserRole } from '@/domain/user'
import { string } from 'better-auth'
import { role } from 'better-auth/plugins'

export interface UserDTO {
    id: string
    email: string
    name: string
    role: UserRole
    boxId: string | null
    createdAt: Date
    updatedAt: Date
}

export interface CreateUserDTO {
    email: string
    password: string
    name: string
    role: 'COACH' | 'ATHLETE'
}

export interface UpdateUserDTO {
    name?: string
    role?: UserRole
}

export interface UserListResponse{
    users: UserDTO[]
    total: number
}

export interface UserWithBox extends UserDTO {
    box: {
        id: string
        name: string
    } | null
}