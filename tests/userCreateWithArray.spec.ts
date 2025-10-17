import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { postAPI } from '../utils/apiCallHelper';

test.describe('User Create With Array Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test("Creates list of users with given input array", async ({ request }) => {
        const createUsersRequestBody = [
            {
                "id": faker.number.int({ min: 1, max: 100000 }),
                "username": `User1-${faker.string.alphanumeric(6)}`,
                "firstName": faker.person.firstName(),
                "lastName": faker.person.lastName(),
                "email": faker.internet.email(),
                "password": faker.internet.password({ length: 10 }),
                "phone": faker.phone.number(),
                "userStatus": faker.number.int({ min: 0, max: 2 })
            },
            {
                "id": faker.number.int({ min: 1, max: 100000 }),
                "username": `User2-${faker.string.alphanumeric(6)}`,
                "firstName": faker.person.firstName(),
                "lastName": faker.person.lastName(),
                "email": faker.internet.email(),
                "password": faker.internet.password({ length: 10 }),
                "phone": faker.phone.number(),
                "userStatus": faker.number.int({ min: 0, max: 2 })
            }
        ];

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