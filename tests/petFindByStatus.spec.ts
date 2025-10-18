import {test, expect} from '@playwright/test';
import { z } from 'zod';
import { getAPI } from '../utils/apiCallHelper';

test.describe('Find Pets by Status Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    // Simple response schema - just validate it's an array
    const FindPetsByStatusResponseSchema = z.array(z.any());

    // List of statuses to test
    const petStatuses = ['available', 'pending', 'sold'];

    // Loop through each status and create a test
    for (const status of petStatuses) {
        test(`Find pets with status: ${status}`, async ({ request }) => {
            const response = await getAPI(
                request,
                `${BASE_URL}/pet/findByStatus?status=${status}`,
                200,
                FindPetsByStatusResponseSchema
            );

            
        });
    }

});