import { APIRequestContext, APIResponse } from '@playwright/test';
import { z } from 'zod';
import { faker } from '@faker-js/faker';

type ZodSchema = z.ZodSchema;


/**
 * Explanation: Reusable GET method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param expectedStatusCode  -> expected status code of the API response
 * @param expectedSchema  -> expected schema of the API response
 * @param retryCount  -> number of times to retry the API call in case of failure (Optional, default is 5   )
 * @returns  -> the API response
 */
export async function getAPI(
    request: APIRequestContext,
    url: string,
    expectedStatusCode: number,
    expectedSchema: ZodSchema,
    retryCount: number = 5, // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {

    // retry logic because API is not working properly, it will retry 5 times before failing the test
    for (let i = 0; i < retryCount; i++) {
        // make the API call
        const response = await request.get(url);

        // validate status code and schema if status code is expected, otherwise retry
        if (response.status() === expectedStatusCode) {
            const responseBodyJson = await response.json()
            expectedSchema.parse(responseBodyJson)
            return response;
        }
        console.log(`Attempt ${i + 1} failed. Retrying...`);
    }

    // if all retries was unsuccessful, throw an error
    throw new Error('Max retries reached. API call failed.');
}

/**
 * Explanation: Reusable POST method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param requestBody -> the request body to be sent in the API call
 * @param expectedStatusCode -> expected status code of the API response
 * @param expectedSchema -> expected schema of the API response
 * @param retryCount -> number of times to retry the API call in case of failure (Optional, default is 5)
 * @returns -> the API response
 */
export async function postAPI(
    request: APIRequestContext,
    url: string,
    requestBody: any,
    expectedStatusCode: number,
    expectedSchema: ZodSchema,
    retryCount: number = 5, // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {

    // retry logic because API is not working properly, it will retry 5 times before failing the test
    for (let i = 0; i < retryCount; i++) {
        // make the API call
        const response = await request.post(url, { data: requestBody });

        // validate status code and schema if status code is expected, otherwise retry
        if (response.status() === expectedStatusCode) {
            const responseBodyJson = await response.json()
            expectedSchema.parse(responseBodyJson)
            return response;
        }
        console.log(`Attempt ${i + 1} failed. Retrying...`);
    }

    // if all retries was unsuccessful, throw an error
    throw new Error('Max retries reached. API call failed.');
}

/**
 * Explanation: Reusable PUT method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param requestBody -> the request body to be sent in the API call
 * @param expectedStatusCode -> expected status code of the API response
 * @param expectedSchema -> expected schema of the API response
 * @param retryCount -> number of times to retry the API call in case of failure (Optional, default is 5)
 * @returns -> the API response
 */
export async function putAPI(
    request: APIRequestContext,
    url: string,
    requestBody: any,
    expectedStatusCode: number,
    expectedSchema: ZodSchema,
    retryCount: number = 5, // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {   
    // retry logic because API is not working properly, it will retry 5 times before failing the test
    for (let i = 0; i < retryCount; i++) {
        // make the API call
        const response = await request.put(url, { data: requestBody });

        // validate status code and schema if status code is expected, otherwise retry
        if (response.status() === expectedStatusCode) {
            const responseBodyJson = await response.json()
            expectedSchema.parse(responseBodyJson)
            return response;
        }
        console.log(`Attempt ${i + 1} failed. Retrying...`);
    }

    // if all retries was unsuccessful, throw an error
    throw new Error('Max retries reached. API call failed.');
}

/**
 * Explanation: Reusable DELETE method with retry logic
 * @param request -> Playwright's APIRequestContext comes from the test method
 * @param url -> the complete URL of the API endpoint
 * @param expectedStatusCode -> expected status code of the API response
 * @param expectedSchema -> expected schema of the API response
 * @param retryCount -> number of times to retry the API call in case of failure (Optional, default is 5)
 * @returns -> the API response
 */
export async function deleteAPI(
    request: APIRequestContext,
    url: string,
    expectedStatusCode: number,
    expectedSchema: ZodSchema,
    retryCount: number = 5, // default retry count is 5, if not provided, OPTIONAL parameter
): Promise<APIResponse> {

    // retry logic because API is not working properly, it will retry 5 times before failing the test
    for (let i = 0; i < retryCount; i++) {
        // make the API call
        const response = await request.delete(url);

        // validate status code and schema if status code is expected, otherwise retry
        if (response.status() === expectedStatusCode) {
            const responseBodyJson = await response.json()
            expectedSchema.parse(responseBodyJson)
            return response;
        }
        console.log(`Attempt ${i + 1} failed. Retrying...`);
    }

    // if all retries was unsuccessful, throw an error
    throw new Error('Max retries reached. API call failed.');
}

/**
 * Creates an array of random user JSON objects for testing
 * @param amountOfUsers -> number of users to generate
 * @returns -> array of user objects with random data for edge case coverage
 */
export function createRandomUsersRequestBody(amountOfUsers: number) {
    const users = [];
    
    for (let i = 1; i <= amountOfUsers; i++) {
        const user = {
            "id": faker.number.int({ min: 1, max: 999999 }),
            "username": `User${i}-${faker.internet.username()}-${faker.string.alphanumeric(faker.number.int({ min: 3, max: 8 }))}`,
            "firstName": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": faker.internet.password({ length: faker.number.int({ min: 8, max: 20 }) }),
            "phone": faker.helpers.arrayElement([
                faker.phone.number(),
                "123-456-7890",
                "(123) 456-7890", 
                "+1-123-456-7890"
            ]),
            "userStatus": faker.number.int({ min: 0, max: 5 })
        };
        users.push(user);
    }
    
    return users;
}
