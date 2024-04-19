import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"username must be at 2 characters")
    .max(2,"username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/,"username must not contain special charater")
    

export const signupSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6,{message : "password must be at least 6 characters"})
})
   












