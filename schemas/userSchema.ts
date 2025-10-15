import {z} from 'zod';

export const expectedCreateUserResponseSchema  = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.string()
});