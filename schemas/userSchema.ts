import { z } from 'zod';

// User schema for Get User API response
export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    phone: z.string(),
    userStatus: z.number()
});

// Create User Request Schema
export const CreateUserRequestSchema = z.object({
    id: z.number(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    userStatus: z.number()
});

// Create User Response Schema
export const CreateUserResponseSchema = z.object({
    code: z.literal(200),
    type: z.literal("unknown"),
    message: z.string()
});

