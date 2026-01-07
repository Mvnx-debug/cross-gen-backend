import type { Config } from 'drizzle-kit'

export default {
    dialect: 'postgresql',
    schema: './src/shared/db/schema',
    out: './drizzle',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
} satisfies Config
