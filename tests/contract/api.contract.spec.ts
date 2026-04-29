import { test, expect, createPact, validateSchema, UserSchema, PostSchema, CommentSchema } from "../../src/proxy";
import { PactV4, MatchersV3 } from "@pact-foundation/pact";

const { like, eachLike, integer, string, regex } = MatchersV3;

test.describe("Users API - Consumer Contract @contract", () => {
  const provider: PactV4 = createPact("web-frontend", "users-service");

  test("GET /users/:id - should return a user matching the contract", async () => {
    await provider
      .addInteraction()
      .given("a user with ID 1 exists")
      .uponReceiving("a request to get user by ID")
      .withRequest("GET", "/users/1", (builder) => {
        builder.headers({ Accept: "application/json" });
      })
      .willRespondWith(200, (builder) => {
        builder
          .headers({ "Content-Type": "application/json" })
          .jsonBody(
            like({
              id: integer(1),
              name: string("Leanne Graham"),
              username: string("Bret"),
              email: regex(".+@.+\\..+", "Sincere@april.biz"),
              address: like({
                street: string("Kulas Light"),
                suite: string("Apt. 556"),
                city: string("Gwenborough"),
                zipcode: regex("\\d{5}(-\\d{4})?", "92998-3874"),
                geo: like({
                  lat: string("-37.3159"),
                  lng: string("81.1496"),
                }),
              }),
              phone: string("1-770-736-8031 x56442"),
              website: string("hildegard.org"),
              company: like({
                name: string("Romaguera-Crona"),
                catchPhrase: string(
                  "Multi-layered client-server neural-net"
                ),
                bs: string("harness real-time e-markets"),
              }),
            })
          );
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/users/1`, {
          headers: { Accept: "application/json" },
        });

        expect(response.status).toBe(200);
        const body = await response.json();

        const result = validateSchema(UserSchema, body);
        expect(result.success).toBe(true);
      });
  });

  test("GET /users - should return a list of users matching the contract", async () => {
    await provider
      .addInteraction()
      .given("users exist")
      .uponReceiving("a request to list all users")
      .withRequest("GET", "/users", (builder) => {
        builder.headers({ Accept: "application/json" });
      })
      .willRespondWith(200, (builder) => {
        builder
          .headers({ "Content-Type": "application/json" })
          .jsonBody(
            eachLike({
              id: integer(1),
              name: string("Leanne Graham"),
              username: string("Bret"),
              email: regex(".+@.+\\..+", "Sincere@april.biz"),
              address: like({
                street: string("Kulas Light"),
                suite: string("Apt. 556"),
                city: string("Gwenborough"),
                zipcode: string("92998-3874"),
                geo: like({
                  lat: string("-37.3159"),
                  lng: string("81.1496"),
                }),
              }),
              phone: string("1-770-736-8031 x56442"),
              website: string("hildegard.org"),
              company: like({
                name: string("Romaguera-Crona"),
                catchPhrase: string(
                  "Multi-layered client-server neural-net"
                ),
                bs: string("harness real-time e-markets"),
              }),
            })
          );
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/users`, {
          headers: { Accept: "application/json" },
        });

        expect(response.status).toBe(200);
        const body = (await response.json()) as Record<string, unknown>[];

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);

        const result = validateSchema(UserSchema, body[0]);
        expect(result.success).toBe(true);
      });
  });
});

test.describe("Posts API - Consumer Contract @contract", () => {
  const provider: PactV4 = createPact("web-frontend", "posts-service");

  test("GET /posts/:id - should return a post matching the contract", async () => {
    await provider
      .addInteraction()
      .given("a post with ID 1 exists")
      .uponReceiving("a request to get post by ID")
      .withRequest("GET", "/posts/1", (builder) => {
        builder.headers({ Accept: "application/json" });
      })
      .willRespondWith(200, (builder) => {
        builder
          .headers({ "Content-Type": "application/json" })
          .jsonBody(
            like({
              userId: integer(1),
              id: integer(1),
              title: string(
                "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
              ),
              body: string("quia et suscipit"),
            })
          );
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/posts/1`, {
          headers: { Accept: "application/json" },
        });

        expect(response.status).toBe(200);
        const body = await response.json();

        const result = validateSchema(PostSchema, body);
        expect(result.success).toBe(true);
      });
  });

  test("POST /posts - should create a post matching the contract", async () => {
    await provider
      .addInteraction()
      .given("the posts service is available")
      .uponReceiving("a request to create a new post")
      .withRequest("POST", "/posts", (builder) => {
        builder
          .headers({
            "Content-Type": "application/json",
            Accept: "application/json",
          })
          .jsonBody(
            like({
              userId: integer(1),
              title: string("New Post Title"),
              body: string("New post body content"),
            })
          );
      })
      .willRespondWith(201, (builder) => {
        builder
          .headers({ "Content-Type": "application/json" })
          .jsonBody(
            like({
              userId: integer(1),
              id: integer(101),
              title: string("New Post Title"),
              body: string("New post body content"),
            })
          );
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userId: 1,
            title: "New Post Title",
            body: "New post body content",
          }),
        });

        expect(response.status).toBe(201);
        const responseBody = (await response.json()) as Record<string, unknown>;

        expect(responseBody).toHaveProperty("id");
        expect(responseBody.title).toBe("New Post Title");
      });
  });
});

test.describe("Comments API - Consumer Contract @contract", () => {
  const provider: PactV4 = createPact("web-frontend", "comments-service");

  test("GET /posts/:id/comments - should return comments matching the contract", async () => {
    await provider
      .addInteraction()
      .given("post 1 has comments")
      .uponReceiving("a request to get comments for post 1")
      .withRequest("GET", "/posts/1/comments", (builder) => {
        builder.headers({ Accept: "application/json" });
      })
      .willRespondWith(200, (builder) => {
        builder
          .headers({ "Content-Type": "application/json" })
          .jsonBody(
            eachLike({
              postId: integer(1),
              id: integer(1),
              name: string("id labore ex et quam laborum"),
              email: regex(".+@.+\\..+", "Eliseo@gardner.biz"),
              body: string("laudantium enim quasi est quidem magnam voluptate"),
            })
          );
      })
      .executeTest(async (mockServer) => {
        const response = await fetch(
          `${mockServer.url}/posts/1/comments`,
          { headers: { Accept: "application/json" } }
        );

        expect(response.status).toBe(200);
        const body = (await response.json()) as Record<string, unknown>[];

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);

        const result = validateSchema(CommentSchema, body[0]);
        expect(result.success).toBe(true);
      });
  });
});
