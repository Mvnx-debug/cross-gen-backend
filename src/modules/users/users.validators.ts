import { t } from 'elysia'

export const createUserSchema = t.Object({
  email: t.String({ 
    format: 'email',
    minLength: 5,
    maxLength: 255 
  }),
  password: t.String({ 
    minLength: 6,
    maxLength: 100 
  }),
  name: t.String({ 
    minLength: 3,
    maxLength: 255 
  }),
  role: t.Union([
    t.Literal('COACH'),
    t.Literal('ATHLETE'),
  ]),
})

export const updateUserSchema = t.Object({
  name: t.Optional(t.String({ 
    minLength: 3,
    maxLength: 255 
  })),
  role: t.Optional(t.Union([
    t.Literal('OWNER'),
    t.Literal('COACH'),
    t.Literal('ATHLETE'),
  ])),
})

export const userIdSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})