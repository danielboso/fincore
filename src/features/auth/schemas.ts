import * as v from 'valibot'

export const loginSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, 'Username must be at least 3 characters'),
    v.maxLength(32, 'Username is too long')
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, 'Password must be at least 8 characters')
  ),
})

export type LoginSchema = v.InferOutput<typeof loginSchema>
