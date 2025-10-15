import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { UserSchema } from '../schemas/userSchema';


test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test('Create a new user', async ({ request }) => {
        const createUserRequestBody = {
            "id": 12312,
            "username": "TestUserNameSalih123",
            "firstName": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": "Test1234!",
            "phone": faker.phone.number(),
            "userStatus": 0
        };

        const createUserResponse = await request.post(`${BASE_URL}/user`, {
            data: createUserRequestBody,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(createUserResponse.status()).toBe(200);

        const expectedCreateUserResponseSchema  = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createUserRequestBody.id.toString())
        });
        const actualResponseBody = await createUserResponse.json();
        expectedCreateUserResponseSchema.parse(actualResponseBody);

    });

    test('Get user by username', async ({ request }) => {
        const username = "TestUserNameSalih123";
        const getUserResponse = await request.get(`${process.env.BASE_URL}${process.env.API_VERSION}/user/${username}`);
        expect(getUserResponse.status()).toBe(200);
        
        const expectedGetUserResponseSchemaZod = z.object({
            "id": z.number(),
            "username": z.literal(username),
            "firstName": z.string(),
            "lastName": z.string(),
            "email": z.string(),
            "password": z.string(),
            "phone": z.string(),
            "userStatus": z.number()
        });
        
        const actualGetUserResponseBody = await getUserResponse.json();
        expectedGetUserResponseSchemaZod.parse(actualGetUserResponseBody);
    });

});
