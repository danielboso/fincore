import * as v from 'valibot'

export const loginSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, 'Username must be at least 3 characters'),
    v.maxLength(20, 'Username must be at most 20 characters')
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, 'Password must be at least 8 characters')
  ),
})

export type LoginSchema = v.InferOutput<typeof loginSchema>

export const registerSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, 'Name must be at least 2 characters')
  ),
  username: v.pipe(
    v.string(),
    v.minLength(3, 'Username must be at least 3 characters'),
    v.maxLength(20, 'Username must be at most 20 characters')
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, 'Password must be at least 8 characters')
  ),
})

export type RegisterSchema = v.InferOutput<typeof registerSchema>
