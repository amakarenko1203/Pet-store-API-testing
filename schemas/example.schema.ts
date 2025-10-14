import { z } from 'zod';

// Pet schema for Pet Store API
export const PetSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  photoUrls: z.array(z.string()),
  tags: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })).optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
});

// User schema for Pet Store API
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().optional(),
  phone: z.string().optional(),
  userStatus: z.number().optional(),
});

// Order schema for Pet Store API
export const OrderSchema = z.object({
  id: z.number(),
  petId: z.number(),
  quantity: z.number(),
  shipDate: z.string().optional(),
  status: z.enum(['placed', 'approved', 'delivered']).optional(),
  complete: z.boolean().optional(),
});

// API Response schemas
export const ApiResponseSchema = z.object({
  code: z.number(),
  type: z.string(),
  message: z.string(),
});

// Error schema
export const ErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  type: z.string().optional(),
});

// Create Pet request schema
export const CreatePetRequestSchema = z.object({
  name: z.string(),
  photoUrls: z.array(z.string()),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  tags: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })).optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
});

// Create User request schema
export const CreateUserRequestSchema = z.object({
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string().optional(),
  userStatus: z.number().optional(),
});

// Type exports for TypeScript
export type Pet = z.infer<typeof PetSchema>;
export type User = z.infer<typeof UserSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type CreatePetRequest = z.infer<typeof CreatePetRequestSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;