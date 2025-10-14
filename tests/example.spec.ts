import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { 
  PetSchema, 
  UserSchema, 
  CreatePetRequestSchema, 
  CreateUserRequestSchema,
  ApiResponseSchema,
  type Pet,
  type User,
  type CreatePetRequest,
  type CreateUserRequest
} from '../schemas/example.schema';

test.describe('Pet Store API Tests', () => {
  
  test.describe('Pet Operations', () => {
    let createdPetId: number;

    test('should create a new pet', async ({ request }) => {
      // Generate test data using Faker
      const petData: CreatePetRequest = {
        name: faker.animal.dog(),
        photoUrls: [faker.image.url()],
        category: {
          id: faker.number.int({ min: 1, max: 100 }),
          name: faker.animal.type(),
        },
        tags: [
          {
            id: faker.number.int({ min: 1, max: 100 }),
            name: faker.word.noun(),
          }
        ],
        status: 'available'
      };

      // Validate request data against schema
      const validatedData = CreatePetRequestSchema.parse(petData);

      // Make API request
      const response = await request.post('/pet', {
        data: validatedData
      });

      // Assert response status
      expect(response.status()).toBe(200);

      // Parse and validate response
      const responseBody = await response.json();
      const validatedPet = PetSchema.parse(responseBody);

      // Store created pet ID for cleanup
      createdPetId = validatedPet.id;

      // Assertions
      expect(validatedPet.name).toBe(petData.name);
      expect(validatedPet.status).toBe('available');
      expect(validatedPet.category?.name).toBe(petData.category?.name);
    });

    test('should get pet by ID', async ({ request }) => {
      // Use a known pet ID or create one first
      const petId = createdPetId || 1;

      const response = await request.get(`/pet/${petId}`);
      
      if (response.status() === 200) {
        const responseBody = await response.json();
        const validatedPet = PetSchema.parse(responseBody);
        
        expect(validatedPet.id).toBe(petId);
        expect(validatedPet.name).toBeDefined();
      } else {
        expect(response.status()).toBe(404);
      }
    });

    test('should update pet', async ({ request }) => {
      if (!createdPetId) {
        test.skip('No pet created to update');
      }

      const updatedPetData = {
        id: createdPetId,
        name: faker.animal.cat(),
        photoUrls: [faker.image.url()],
        status: 'sold'
      };

      const response = await request.put('/pet', {
        data: updatedPetData
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      const validatedPet = PetSchema.parse(responseBody);

      expect(validatedPet.name).toBe(updatedPetData.name);
      expect(validatedPet.status).toBe('sold');
    });

    test('should find pets by status', async ({ request }) => {
      const response = await request.get('/pet/findByStatus?status=available');
      
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      
      // Validate each pet in the array
      responseBody.forEach((pet: any) => {
        const validatedPet = PetSchema.parse(pet);
        expect(validatedPet.status).toBe('available');
      });
    });

    test('should delete pet', async ({ request }) => {
      if (!createdPetId) {
        test.skip('No pet created to delete');
      }

      const response = await request.delete(`/pet/${createdPetId}`);
      
      expect([200, 404]).toContain(response.status());

      // Verify pet is deleted
      const getResponse = await request.get(`/pet/${createdPetId}`);
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('User Operations', () => {
    let createdUsername: string;

    test('should create a new user', async ({ request }) => {
      // Generate test data using Faker
      const userData: CreateUserRequest = {
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        userStatus: faker.number.int({ min: 0, max: 1 })
      };

      // Validate request data
      const validatedData = CreateUserRequestSchema.parse(userData);
      createdUsername = validatedData.username;

      const response = await request.post('/user', {
        data: validatedData
      });

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      const validatedResponse = ApiResponseSchema.parse(responseBody);
      
      expect(validatedResponse.code).toBe(200);
    });

    test('should get user by username', async ({ request }) => {
      if (!createdUsername) {
        test.skip('No user created to retrieve');
      }

      const response = await request.get(`/user/${createdUsername}`);
      
      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      const validatedUser = UserSchema.parse(responseBody);
      
      expect(validatedUser.username).toBe(createdUsername);
    });

    test('should update user', async ({ request }) => {
      if (!createdUsername) {
        test.skip('No user created to update');
      }

      const updatedUserData = {
        username: createdUsername,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        userStatus: 1
      };

      const response = await request.put(`/user/${createdUsername}`, {
        data: updatedUserData
      });

      expect(response.status()).toBe(200);
    });

    test('should delete user', async ({ request }) => {
      if (!createdUsername) {
        test.skip('No user created to delete');
      }

      const response = await request.delete(`/user/${createdUsername}`);
      
      expect(response.status()).toBe(200);

      // Verify user is deleted
      const getResponse = await request.get(`/user/${createdUsername}`);
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid pet ID', async ({ request }) => {
      const response = await request.get('/pet/invalid-id');
      
      expect(response.status()).toBe(404);
    });

    test('should handle non-existent user', async ({ request }) => {
      const response = await request.get(`/user/${faker.string.uuid()}`);
      
      expect(response.status()).toBe(404);
    });

    test('should validate required fields for pet creation', async ({ request }) => {
      const invalidPetData = {
        // Missing required fields
        name: '',
        photoUrls: []
      };

      const response = await request.post('/pet', {
        data: invalidPetData
      });

      expect([400, 405, 422]).toContain(response.status());
    });
  });
});