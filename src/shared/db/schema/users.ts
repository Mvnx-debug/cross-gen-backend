import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { boxes } from './boxes'

export const userRoleEnum = pgEnum('user_role', ['OWNER', 'COACH', 'ATHLETE'])

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    authUserId: text('auth_user_id').notNull().unique(),

    boxId: uuid('box_id')
        .references(() => boxes.id)
        .notNull(),

    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: userRoleEnum('role').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
})