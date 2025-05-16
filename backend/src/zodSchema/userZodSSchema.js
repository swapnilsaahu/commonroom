import { z } from "zod";

const userZodSchema = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
})

export const signupSchema = userZodSchema;
export const loginSchema = userZodSchema.pick({
    username: true,
    password: true
});
