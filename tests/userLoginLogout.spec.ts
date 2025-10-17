import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { getAPI, postAPI, deleteAPI } from '../utils/apiCallHelper';

test.describe('User Login and Logout Tests', () => {
    const BASE_URL = `${process.env.BASE_URL}${process.env.API_VERSION}`;
    let createUserRequestBody: any;
    let username: string;
    let password: string;

    test.beforeEach(async ({ request }) => {
        createUserRequestBody = {
            "id": faker.number.int({ min: 1, max: 100000 }),
            "username": `TestUser-${faker.string.alphanumeric(8)}`,
            "firstName": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": faker.internet.password({ length: 10 }),
            "phone": faker.phone.number(),
            "userStatus": faker.number.int({ min: 0, max: 10 })
        };

        username = createUserRequestBody.username;
        password = createUserRequestBody.password;

        const responseCreateUserSchemaZod = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(createUserRequestBody.id.toString())
        });

        await postAPI(
            request,
            `${BASE_URL}/user`,
            createUserRequestBody,
            200,
            responseCreateUserSchemaZod,
            5
        );
    });

    test("logs user into the system", async ({ request }) => {
        const responseGetLoginUserSchemaZod = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.string().regex(/^logged in user session:/)
        });

        await getAPI(
            request,
            `${BASE_URL}/user/login?username=TestUserNameSalih123&password=Test1234!`,
            200,
            responseGetLoginUserSchemaZod
        );
    });

    test("logs out current logged in user", async ({ request }) => {
        const responseGetLogoutUserSchemaZod = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal("ok")
        });

        await getAPI(
            request,
            `${BASE_URL}/user/logout`,
            200,
            responseGetLogoutUserSchemaZod
        );
    });

    test.afterEach(async ({ request }) => {
        const responseDeleteUserSchemaZod = z.object({
            code: z.literal(200),
            type: z.literal("unknown"),
            message: z.literal(username)
        });

        await deleteAPI(
            request,
            `${BASE_URL}/user/${username}`,
            200,
            responseDeleteUserSchemaZod
        );
    });

});