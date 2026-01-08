export interface AuthUser {
    id: string
    email: string
    name?: string | null
}
export interface AuthSession {
    user: AuthUser
}

