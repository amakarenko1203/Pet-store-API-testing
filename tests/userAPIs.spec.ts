import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { getAPI, postAPI, putAPI, deleteAPI } from '../utils/apiCallHelper';

test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;

    test('End-to-end test flow for User APIs - Create, Get, Put, Delete', async ({ request }) => {
        // Create user data for CRUD operations
        const createUserRequestBody = {
            "id": faker.number.int({ min: 1, max: 100000 }),
            "username": "TestUserName-delete-me",
            "firstName": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": faker.internet.password(),
            "phone": faker.phone.number(),
            "userStatus": faker.number.int({ min: 0, max: 10 })
        };

        // Update user data for PUT operation
        const updateUserRequestBody = {
            "id": createUserRequestBody.id,
            "username": createUserRequestBody.username,
            "firstName": "UpdatedFirstName",
            "lastName": "UpdatedLastName",
            "email": faker.internet.email(),
            "password": "updatedPassword123",
            "phone": faker.phone.number(),
            "userStatus": faker.number.int({ min: 0, max: 10 })
        };

        // Define user data for CRUD operations
        const username = createUserRequestBody.username;

        // Define schemas for each operation
        const expectedCreateUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createUserRequestBody.id.toString())
        });

        const expectedGetUserResponseSchema = z.object({
            id: z.number(),
            username: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            password: z.string(),
            phone: z.string(),
            userStatus: z.number()
        });

        const expectedUpdateUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createUserRequestBody.id.toString())
        });

        const expectedDeleteUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(username)
        });

        // Post -> Create a new user
        await postAPI(
            request,
            `${BASE_URL}/user`,
            createUserRequestBody,
            200,
            expectedCreateUserResponseSchema
        );

        // Get -> Get created user
        await getAPI(
            request,
            `${BASE_URL}/user/${username}`,
            200,
            expectedGetUserResponseSchema
        );

        // Put -> Update user details
        await putAPI(
            request,
            `${BASE_URL}/user/${username}`,
            updateUserRequestBody,
            200,
            expectedUpdateUserResponseSchema
        );

        // Delete -> Delete created user
        await deleteAPI(
            request,
            `${BASE_URL}/user/${username}`,
            200,
            expectedDeleteUserResponseSchema
        );
    });

});
