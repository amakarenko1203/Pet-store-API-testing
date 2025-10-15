import {test, expect} from '@playwright/test';
import { fa, faker } from '@faker-js/faker';
import { z } from 'zod';
import { UserSchema } from '../schemas/userSchema';
import { create } from 'domain';


test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;
    let createUserRequestBody: any;

    test.beforeEach(async ({ request }) => {
        // Create a new user before each test and store the request body
        createUserRequestBody = {
            "id": faker.number.int({ min: 1, max: 100000 }),
            "username": "TestUserName-delete-me",
            "firstName": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": faker.internet.password(),
            "phone": faker.phone.number(),
            "userStatus": faker.number.int({ min: 0, max: 10 })
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

    test('Create a new user', async () => {
        // The user is already created in beforeEach, so just check the request body exists
        expect(createUserRequestBody).toBeDefined();
    });

    test('Get user by username', async ({ request }) => {
        const username = createUserRequestBody.username;
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

    test('Delete user by username', async ({ request }) => {
        const username = createUserRequestBody.username;
        const deleteUserResponse = await request.delete(`${process.env.BASE_URL}${process.env.API_VERSION}/user/${username}`);
        expect(deleteUserResponse.status()).toBe(200);
        
        const expectedDeleteUserResponseSchemaZod = z.object({
            "code": z.literal(200),
            "type": z.literal("unknown"),
            "message": z.literal(username)
        });
        
        const actualDeleteUserResponseBody = await deleteUserResponse.json();
        expectedDeleteUserResponseSchemaZod.parse(actualDeleteUserResponseBody);
    });

});
