import { APIRequestContext, APIResponse } from '@playwright/test';
import { ZodTypeAny } from 'zod';


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
    expectedSchema: ZodTypeAny,
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
    expectedSchema: ZodTypeAny,
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
    expectedSchema: ZodTypeAny,
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
    expectedSchema: ZodTypeAny,
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