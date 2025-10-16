import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { PetSchema, CreatePetRequestSchema, CategorySchema, TagSchema } from '../schemas/petSchema';
import { getAPI, postAPI, putAPI, deleteAPI } from '../utils/apiCallHelper';

test.describe('Pet API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test('End-to-end test flow for Pet APIs - Create, Get, Put, Delete', async ({ request }) => {
       
        const createPetRequestBody = {
            "id": 4521,
            "category": {
                "id": 3072,
                "name": "string"
            },
            "name": "doggie",
            "photoUrls": [
                "string",
                "string"
            ],
            "tags": [
                {
                    "id": 6330,
                    "name": "string"
                },
                {
                    "id": 5622,
                    "name": "string"
                }
            ],
            "status": "pending"
        };

        const updatePetRequestBody = {
            "id": 4521,
            "category": {
                "id": 3072,
                "name": "UpdatedCategory"
            },
            "name": "UpdatedDoggie",
            "photoUrls": [
                "updated-photo-url-1",
                "updated-photo-url-2"
            ],
            "tags": [
                {
                    "id": 6330,
                    "name": "UpdatedTag1"
                },
                {
                    "id": 5622,
                    "name": "UpdatedTag2"
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

        const expectedGetPetResponseSchema = PetSchema;

        const expectedUpdatePetResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.string()
        });

        const expectedDeletePetResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(petId.toString())
        });

        // Post -> Create a new pet
        await postAPI(
            request,
            `${BASE_URL}/pet`,
            createPetRequestBody,
            200,
            expectedCreatePetResponseSchema
        );

        // Get -> Get created pet
        await getAPI(
            request,
            `${BASE_URL}/pet/${petId}`,
            200,
            expectedGetPetResponseSchema
        );

        // Put -> Update pet details
        await putAPI(
            request,
            `${BASE_URL}/pet`,
            updatePetRequestBody,
            200,
            expectedUpdatePetResponseSchema
        );

        // Delete -> Delete created pet
        await deleteAPI(
            request,
            `${BASE_URL}/pet/${petId}`,
            200,
            expectedDeletePetResponseSchema
        );
    });

});