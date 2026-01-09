import type { UserRole } from '@/domain/user';

export interface AuthSession {
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    };
    user: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;

    };

}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    boxId: string | null;
    role: UserRole;
}

export interface AuthContext {
    auth: AuthSession['user'];
    user: AuthUser;
}


