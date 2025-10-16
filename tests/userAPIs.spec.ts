import {test, expect} from '@playwright/test';
import { fa, faker } from '@faker-js/faker';
import { z } from 'zod';
import { UserSchema } from '../schemas/userSchema';
import { getAPI, postAPI, putAPI, deleteAPI } from '../utils/apiCallHelper';


test.describe('User API Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;
    let createUserRequestBody: any;
    let updateUserRequestBody: any;
    
    const expectedUpdateUserResponseSchema = z.object({
        code: z.literal(200),
        type: z.literal("unknown"),
        message: z.string()
    });

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

        updateUserRequestBody = {
            "id": 12312,
            "username": "TestUserNameSalih123",
            "firstName": "UpdatedFirstName",
            "lastName": "UpdatedLastName",
            "email": "updated.email@example.com",
            "password": "Test1234!",
            "phone": "+1-555-0199",
            "userStatus": 0
        };

        const expectedCreateUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createUserRequestBody.id.toString())
        });

        await postAPI(
            request,
            `${BASE_URL}/user`,
            createUserRequestBody,
            200,
            expectedCreateUserResponseSchema
        );
    });

    test('Create a new user', async ({ request }) => {
        const expectedCreateUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createUserRequestBody.id.toString())
        });

        await postAPI(
            request,
            `${BASE_URL}/user`,
            createUserRequestBody,
            200,
            expectedCreateUserResponseSchema
        );
    });

    test('Get user by username', async ({ request }) => {
        const username = createUserRequestBody.username;
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
        
        await getAPI(
            request,
            `${BASE_URL}/user/${username}`,
            200,
            expectedGetUserResponseSchema
        );
    });

    test('Delete user by username', async ({ request }) => {
        const username = createUserRequestBody.username;
        const expectedDeleteUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(username)
        });
        
        await deleteAPI(
            request,
            `${BASE_URL}/user/${username}`,
            200,
            expectedDeleteUserResponseSchema
        );
    });

    test('End-to-end test flow for User APIs - Create, Get, Put, Delete', async ({ request }) => {
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

        const expectedDeleteUserResponseSchema = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(username)
        });

    
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
