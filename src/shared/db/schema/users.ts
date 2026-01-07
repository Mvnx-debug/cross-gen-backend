import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { boxes } from './boxes'

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),

    boxId: uuid('box_id')
        .references(() => boxes.id)
        .notNull(),

    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: text('role').notNull(), // OWNER, COACH, ATHLETE

    createdAt: timestamp('created_at').defaultNow().notNull(),
})