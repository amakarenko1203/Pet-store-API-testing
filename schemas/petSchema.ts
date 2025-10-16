import { z } from 'zod';

// Category schema for pets
export const CategorySchema = z.object({
    id: z.number(),
    name: z.string()
});

// Tag schema for pets
export const TagSchema = z.object({
    id: z.number(),
    name: z.string()
});

// Pet schema for Get Pet API response
export const PetSchema = z.object({
    id: z.number(),
    category: CategorySchema.optional(),
    name: z.string(),
    photoUrls: z.array(z.string()),
    tags: z.array(TagSchema).optional(),
    status: z.enum(["available", "pending", "sold"])
});

//  Pet Request Schema
export const CreatePetRequestSchema = z.object({
    id: z.number(),
    category: CategorySchema.optional(),
    name: z.string(),
    photoUrls: z.array(z.string()),
    tags: z.array(TagSchema).optional(),
    status: z.enum(["available", "pending", "sold"])
});

// Pet Response Schema
export const CreatePetResponseSchema = z.object({
    code: z.literal(200),
    type: z.literal("unknown"),
    message: z.string()
});

// Update Pet Response Schema
export const UpdatePetResponseSchema = z.object({
    code: z.literal(200),
    type: z.literal("unknown"),
    message: z.string()
});

// Delete Pet Response Schema
export const DeletePetResponseSchema = z.object({
    code: z.literal(200),
    type: z.literal("unknown"),
    message: z.string()
});
