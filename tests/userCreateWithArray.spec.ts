import {test, expect} from '@playwright/test';
import { z } from 'zod';
import { postAPI, createRandomUsersRequestBody } from '../utils/apiCallHelper';

test.describe('User Create With Array Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test("Creates list of users with given input array", async ({ request }) => {
        const createUsersRequestBody = createRandomUsersRequestBody(4);

        const responseCreateUsersWithArraySchemaZod = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal("ok")
        });

        await postAPI(
            request,
            `${BASE_URL}/user/createWithArray`,
            createUsersRequestBody,
            200,
            responseCreateUsersWithArraySchemaZod
        );
    });

});