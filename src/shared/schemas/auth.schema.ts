import { z } from "zod"

export const signInSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().nonempty('Password is required')
})

export type SignInSchema = z.infer<typeof signInSchema>