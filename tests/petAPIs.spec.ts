import {test, expect} from '@playwright/test';
import { z } from 'zod';
import { getAPI, postAPI, putAPI, deleteAPI } from '../utils/apiCallHelper';

test.describe('Pet API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test('End-to-end test flow for Pet APIs - Create, Get, Put, Delete', async ({ request }) => {
       
        const createPetRequestBody = {
            "id": 4521,
            "category": {
                "id": 3072,
                "name": "tiger"
            },
            "name": "dolphin",
            "photoUrls": [
                "https://functional-exasperation.info",
                "https://scientific-poppy.org"
            ],
            "tags": [
                {
                    "id": 6330,
                    "name": "crocodile"
                },
                {
                    "id": 5622,
                    "name": "eagle"
                }
            ],
            "status": "pending"
        };

        const updatePetRequestBody = {
            "id": 4521,
            "category": {
                "id": 3072,
                "name": "lion"
            },
            "name": "shark",
            "photoUrls": [
                "https://updated-photo-1.com",
                "https://updated-photo-2.com"
            ],
            "tags": [
                {
                    "id": 6330,
                    "name": "whale"
                },
                {
                    "id": 5622,
                    "name": "octopus"
                }
            ],
            "status": "available"
        };

        const petId = createPetRequestBody.id;


        const expectedCreatePetResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createPetRequestBody.id.toString())
        });

        const CategorySchema = z.object({
            id: z.number(),
            name: z.string()
        });

        const TagSchema = z.object({
            id: z.number(),
            name: z.string()
        });

        const expectedGetPetResponseSchema = z.object({
            id: z.number(),
            category: CategorySchema.optional(),
            name: z.string(),
            photoUrls: z.array(z.string()),
            tags: z.array(TagSchema).optional(),
            status: z.enum(["available", "pending", "sold"])
        });

        const expectedUpdatePetResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createPetRequestBody.id.toString())
        });

        const expectedDeletePetResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(petId.toString())
        });

        // Post 
        await postAPI(
            request,
            `${BASE_URL}/pet`,
            createPetRequestBody,
            200,
            expectedCreatePetResponseSchema
        );

        // Get 
        await getAPI(
            request,
            `${BASE_URL}/pet/${petId}`,
            200,
            expectedGetPetResponseSchema
        );

        // Put 
        await putAPI(
            request,
            `${BASE_URL}/pet`,
            updatePetRequestBody,
            200,
            expectedUpdatePetResponseSchema
        );

        // Delete 
        await deleteAPI(
            request,
            `${BASE_URL}/pet/${petId}`,
            200,
            expectedDeletePetResponseSchema
        );
    });

});
