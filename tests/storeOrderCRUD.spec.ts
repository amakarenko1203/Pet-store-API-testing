import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { getAPI, postAPI, deleteAPI } from '../utils/apiCallHelper';

test.describe('Store Order API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test('End-to-end test flow for Store Order APIs - Create, Get, Delete', async ({ request }) => {
       
        const createOrderRequestBody = {
            "id": faker.number.int({ min: 1, max: 999999 }),
            "petId": faker.number.int({ min: 1, max: 100 }),
            "quantity": faker.number.int({ min: 1, max: 10 }),
            "shipDate": faker.date.future().toISOString(),
            "status": faker.helpers.arrayElement(["placed", "approved", "delivered"]),
            "complete": faker.datatype.boolean()
        };

        const expectedCreateOrderResponseSchema = z.object({
            id: z.number(),
            petId: z.number(),
            quantity: z.number(),
            shipDate: z.string(),
            status: z.enum(["placed", "approved", "delivered"]),
            complete: z.boolean()
        });

        const expectedGetOrderResponseSchema = z.object({
            id: z.number(),
            petId: z.number(),
            quantity: z.number(),
            shipDate: z.string(),
            status: z.enum(["placed", "approved", "delivered"]),
            complete: z.boolean()
        });

        const expectedDeleteOrderResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createOrderRequestBody.id.toString())
        });

        // Post 
        await postAPI(
            request,
            `${BASE_URL}/store/order`,
            createOrderRequestBody,
            200,
            expectedCreateOrderResponseSchema
        );

        // Get 
        await getAPI(
            request,
            `${BASE_URL}/store/order/${createOrderRequestBody.id}`,
            200,
            expectedGetOrderResponseSchema
        );

        // Delete 
        await deleteAPI(
            request,
            `${BASE_URL}/store/order/${createOrderRequestBody.id}`,
            200,
            expectedDeleteOrderResponseSchema
        );
    });

});