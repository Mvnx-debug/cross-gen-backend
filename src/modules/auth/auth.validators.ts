import { t } from 'elysia'

export const setupSchema = t.Object({
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
  boxName: t.String({ 
    minLength: 3,
    maxLength: 255 
  }),
})
