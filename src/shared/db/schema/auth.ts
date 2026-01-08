import { pgTable } from 'drizzle-orm/pg-core'

// Better Auth fornece os schemas prontos
export const user = pgTable('user', (t) => ({
  id: t.text().primaryKey(),
  email: t.text().notNull().unique(),
  emailVerified: t.boolean().notNull().default(false),
  name: t.text().notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
}))

export const session = pgTable('session', (t) => ({
  id: t.text().primaryKey(),
  expiresAt: t.timestamp().notNull(),
  token: t.text().notNull().unique(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
  ipAddress: t.text(),
  userAgent: t.text(),
  userId: t.text().notNull().references(() => user.id),
}))

export const account = pgTable('account', (t) => ({
  id: t.text().primaryKey(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  userId: t.text().notNull().references(() => user.id),
  accessToken: t.text(),
  refreshToken: t.text(),
  idToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  password: t.text(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
}))

export const verification = pgTable('verification', (t) => ({
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().defaultNow(),
  updatedAt: t.timestamp().defaultNow(),
}))