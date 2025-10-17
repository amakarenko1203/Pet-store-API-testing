import {test, expect} from '@playwright/test';
import { z } from 'zod';
import { postAPI, getAPI } from '../utils/apiCallHelper';
import { PetSchema } from '../schemas/petSchema';

test.describe('Pet API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test('Add a new pet to the store', async ({ request }) => {
       
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

        const expectedCreatePetResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createPetRequestBody.id.toString())
        });

        // Post -> Create a new pet
        await postAPI(
            request,
            `${BASE_URL}/pet`,
            createPetRequestBody,
            200,
            expectedCreatePetResponseSchema
        );

        console.log(`Successfully added new pet with ID: ${createPetRequestBody.id} and name: ${createPetRequestBody.name}`);
    });
    // Get pet by id
    test('Get pet by ID', async ({ request }) => {
        const petId = 4521;
        const response = await getAPI(
            request,
            `${BASE_URL}/pet/${petId}`,
            200,
            PetSchema
        );

        const petData = await response.json();

    });

});