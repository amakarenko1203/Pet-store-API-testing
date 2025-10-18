import {test, expect} from '@playwright/test';
import { z } from 'zod';
import { getAPI, postAPI, deleteAPI } from '../utils/apiCallHelper';

test.describe('Store Order API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test('End-to-end test flow for Store Order APIs - Create, Get, Delete', async ({ request }) => {
       
        const createOrderRequestBody = {
            "id": 1380,
            "petId": 0,
            "quantity": 2,
            "shipDate": "2025-10-09T02:11:39.913+0000",
            "status": "delivered",
            "complete": true
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