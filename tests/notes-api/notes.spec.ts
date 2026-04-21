import {
  test,
  expect,
  validateSchema,
  NoteResponseSchema,
  NotesListResponseSchema,
  NoteDeleteResponseSchema,
} from "../../src/proxy";
import type {
  NoteResponse,
  NotesListResponse,
  LoginUserResponse,
} from "../../src/proxy";

const BASE_URL = process.env.NOTES_API_BASE_URL || "https://practice.expandtesting.com/notes/api";

function generateTestUser() {
  const uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    name: `NoteUser_${uid}`,
    email: `noteuser_${uid}@example.com`,
    password: "TestPass123!",
  };
}

let authToken: string;
const testUser = generateTestUser();

test.describe.configure({ mode: "serial" });

test.describe("Notes API - CRUD @notes-api", () => {
  let createdNoteId: string;

  test.beforeAll(async ({ request }) => {
    // Register and login the test user
    await request.post(`${BASE_URL}/users/register`, {
      form: {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      },
    });

    const loginRes = await request.post(`${BASE_URL}/users/login`, {
      form: { email: testUser.email, password: testUser.password },
    });
    const loginBody = (await loginRes.json()) as LoginUserResponse;
    authToken = loginBody.data.token;
  });

  test.afterAll(async ({ request }) => {
    // Cleanup: delete the test user
    await request.delete(`${BASE_URL}/users/delete-account`, {
      headers: { "x-auth-token": authToken },
    });
  });

  test("POST /notes - should create a new note", async ({ apiClient }) => {
    const response = await apiClient.postForm<NoteResponse>(
      `${BASE_URL}/notes`,
      {
        title: "Test Note Title",
        description: "This is a test note description",
        category: "Home",
      },
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(NoteResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.title).toBe("Test Note Title");
    expect(result.data?.data.description).toBe(
      "This is a test note description"
    );
    expect(result.data?.data.category).toBe("Home");
    expect(result.data?.data.completed).toBe(false);

    createdNoteId = response.body.data.id;
  });

  test("GET /notes - should return all notes for the user", async ({
    apiClient,
  }) => {
    const response = await apiClient.get<NotesListResponse>(
      `${BASE_URL}/notes`,
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(NotesListResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.length).toBeGreaterThanOrEqual(1);
  });

  test("GET /notes/:id - should return a note by ID", async ({
    apiClient,
  }) => {
    const response = await apiClient.get<NoteResponse>(
      `${BASE_URL}/notes/${createdNoteId}`,
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(NoteResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.id).toBe(createdNoteId);
    expect(result.data?.data.title).toBe("Test Note Title");
  });

  test("PUT /notes/:id - should update a note", async ({ apiClient }) => {
    const response = await apiClient.putForm<NoteResponse>(
      `${BASE_URL}/notes/${createdNoteId}`,
      {
        title: "Updated Note Title",
        description: "Updated note description",
        completed: "false",
        category: "Work",
      },
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(NoteResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.title).toBe("Updated Note Title");
    expect(result.data?.data.description).toBe("Updated note description");
    expect(result.data?.data.category).toBe("Work");
  });

  test("PATCH /notes/:id - should update completed status", async ({
    apiClient,
  }) => {
    const response = await apiClient.patchForm<NoteResponse>(
      `${BASE_URL}/notes/${createdNoteId}`,
      { completed: "true" },
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(NoteResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.completed).toBe(true);
  });

  test("DELETE /notes/:id - should delete a note", async ({ apiClient }) => {
    const response = await apiClient.delete(
      `${BASE_URL}/notes/${createdNoteId}`,
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(NoteDeleteResponseSchema, response.body);
    expect(result.success).toBe(true);
  });

  test("GET /notes/:id - should return 401 without auth", async ({
    apiClient,
  }) => {
    const response = await apiClient.get(
      `${BASE_URL}/notes/${createdNoteId}`
    );

    expect(response.status).toBe(401);
  });
});

test.describe("Notes API - Validation @notes-api", () => {
  test.beforeAll(async ({ request }) => {
    if (!authToken) {
      const user = generateTestUser();
      await request.post(`${BASE_URL}/users/register`, {
        form: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
      const loginRes = await request.post(`${BASE_URL}/users/login`, {
        form: { email: user.email, password: user.password },
      });
      const loginBody = (await loginRes.json()) as LoginUserResponse;
      authToken = loginBody.data.token;
    }
  });

  test("POST /notes - should fail with missing title", async ({
    apiClient,
  }) => {
    const response = await apiClient.postForm(`${BASE_URL}/notes`, {
      title: "",
      description: "Some description",
      category: "Home",
    }, { headers: { "x-auth-token": authToken } });

    expect(response.status).toBe(400);
  });

  test("POST /notes - should fail with invalid category", async ({
    apiClient,
  }) => {
    const response = await apiClient.postForm(`${BASE_URL}/notes`, {
      title: "Some title",
      description: "Some description",
      category: "InvalidCategory",
    }, { headers: { "x-auth-token": authToken } });

    expect(response.status).toBe(400);
  });
});
