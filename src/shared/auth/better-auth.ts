import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/shared/db';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    emailAndPassword: {
        enabled: true,
    },
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    trustedOrigins: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
    ],
    advanced: {
        useSecureCookies: false,
        crossSubDomainCookies: {
            enabled: false,
        },
        generateSessionToken: true,
        // Desabilitar verificação de Origin em desenvolvimento
        disableCSRFCheck: process.env.NODE_ENV !== 'production',
    },
})