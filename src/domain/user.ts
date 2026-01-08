export type UserRole = 'OWNER' | 'COACH' | 'ATHLETE';

export interface DomainUser {
    id: string
    authUserId: string
    boxId: string
    role: UserRole
}