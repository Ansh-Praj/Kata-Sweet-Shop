import z from "zod";

export const SignupSchema = z.object({
    email: z.email(),
    password: z.string(),
    name: z.string()
})

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string()
})

export const SweetSchema = z.object({
    name: z.string(),
    price: z.coerce.number(),
    quantity: z.coerce.number(),
    category: z.string()
})


