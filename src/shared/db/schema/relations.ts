import { relations } from 'drizzle-orm'
import { users } from './users'
import { boxes } from './boxes'

export const usersRelations = relations(users, ({ one }) => ({
    box: one(boxes, {
        fields: [users.boxId],
        references: [boxes.id],
    }),
}))

export const boxesRelations = relations(boxes, ({ many }) => ({
    users: many(users),
}))
