import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const boxes = pgTable('boxes', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    phone: text('phone'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})