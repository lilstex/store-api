import mongoose from "mongoose";
import request from "supertest";
import app from "../index";
// MongoDB connection URL
const MONGODB_URI: string = process.env.TEST_DB!;

/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
});
  
/* Closing database connection and dropping the specific collection after each test. */
afterAll(async () => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      if (collections.hasOwnProperty(key)) {
        await collections[key].deleteMany({});
      }
    }
    await mongoose.connection.close();
  } catch (error) {
      console.error('Error in afterEach:', error);
  }
});

describe("POST /api/create-user", () => {
  it("Should create user successfully", async () => {
    const res = await request(app)
      .post("/api/create-user")
      .send({
        email: "tester@gmail.com",
        password: "password",
        username: "liza",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data.email).toBe("tester@gmail.com");
    expect(res.body.data).not.toHaveProperty("password");
  });

  // Test for when creating account with existing email
  it("Should not create user if email is already in use", async () => {
    const res = await request(app)
      .post("/api/create-user")
      .send({
        email: "tester@gmail.com",
        password: "password",
        username: "weber",
      });
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch("Email already in use");
  });

  // Test for when creating account with existing username
  it("should not create user if username is already in use", async () => {
    const res = await request(app)
      .post("/api/create-user")
      .send({
        email: "tester2@gmail.com",
        password: "password",
        username: "liza",
      });
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch("Username already in use");
  });
});

describe("User login and other authenticated user actions", () => {
  let authToken: string; // Variable to store the token
  let userId: string; 

  it("POST /api/login (should return incorrect credentials if password is wrong)", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "tester@gmail.com",
        password: "passwords",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch("Incorrect credentials");
  });

  it("POST /api/login (should return incorrect credentials if email is wrong)", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "testerr@gmail.com",
        password: "passwords",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch("Incorrect credentials");
  });

  it("POST /api/login (should login user)", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "tester@gmail.com",
        password: "password",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).not.toHaveProperty("password");

    // Store the token in the variable
    authToken = res.body.data.token;
    // Store user id
    userId = res.body.data.id;
  });

  it("GET /api/get-user (should get user details)", async () => {
    const res = await request(app)
    .get(`/api/get-user?userId=${userId}`)
    .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty("username");
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("GET /api/get-all-users (should get all users)", async () => {
    const res = await request(app)
    .get("/api/get-all-users?page=1&documentCount=10")
    .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.allUsers).toBeInstanceOf(Array);
    expect(res.body.data.allUsers.length).toBeGreaterThan(0);
  });

  it("PATCH /api/update-username (should update user)", async () => {
    const res = await request(app)
      .patch("/api/update-username")
      .send({
        username: "lizy",
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.username).toBe("lizy");
  });

  it("DELETE /api/delete-user (should delete user)", async () => {
    const res = await request(app)
      .delete("/api/delete-user")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("Authenticated user management of products", () => {
  let authToken: string; // To store token of first user
  let authToken2: string; // To store token of second user
  let productId: string; 
  let productId2: string; 
  let productId3: string; 
  let productId4: string; 

  it("Should create user successfully", async () => {
    const res = await request(app)
      .post("/api/create-user")
      .send({
        email: "user@gmail.com",
        password: "password",
        username: "ussy",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data.email).toBe("user@gmail.com");
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("Should create a second user successfully", async () => {
      const res = await request(app)
        .post("/api/create-user")
        .send({
          email: "user2@gmail.com",
          password: "password",
          username: "ussy2",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data.email).toBe("user2@gmail.com");
  });

  it("should login user successfully)", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          email: "user@gmail.com",
          password: "password",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data).not.toHaveProperty("password");
  
      // Store the token in the variable
      authToken = res.body.data.token;
  });

  it("should login second user successfully)", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          email: "user2@gmail.com",
          password: "password",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data).not.toHaveProperty("password");
  
      // Store the token in the variable
      authToken2 = res.body.data.token;
  });

  it("POST /api/product/create-product (should create product successfully)", async () => {
      const res = await request(app)
        .post("/api/product/create-product")
        .send({
          name: "Samsung S1",
          quantity: 1,
          unitPrice: 440000,
          description: "A black samsung galaxy phone"
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("name");

      // Store the token in the variable
      productId = res.body.data._id;
  });

  it("POST /api/product/create-product (should create second product)", async () => {
      const res = await request(app)
        .post("/api/product/create-product")
        .send({
          name: "Samsung S2",
          quantity: 1,
          unitPrice: 440000,
          description: "A black samsung galaxy phone"
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("name");

      // Store the token in the variable
      productId3 = res.body.data._id;
  });

  it("POST /api/product/create-product (should create third product)", async () => {
      const res = await request(app)
        .post("/api/product/create-product")
        .send({
          name: "Samsung S3",
          quantity: 1,
          unitPrice: 440000,
          description: "A black samsung galaxy phone"
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("name");

      // Store the token in the variable
      productId4 = res.body.data._id;
  });

  it("POST /api/product/create-product (should create second user's product successfully)", async () => {
      const res = await request(app)
        .post("/api/product/create-product")
        .send({
          name: "Nokia flap",
          quantity: 1,
          unitPrice: 440000,
          description: "A grey nokia flap"
        })
        .set("Authorization", `Bearer ${authToken2}`);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("name");

      // Store the token in the variable
      productId2 = res.body.data._id;
  });

  it("POST /api/product/create-product (should not create product with already existing name)", async () => {
      const res = await request(app)
        .post("/api/product/create-product")
        .send({
          name: "Samsung S1",
          quantity: 1,
          unitPrice: 540000,
          description: "A samsung galaxy phone"
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toMatch("Product with the same name already exists");
  });

  it("GET /api/product/get-all-products (should get all products)", async () => {
      const res = await request(app)
          .get("/api/product/get-all-products?page=1&documentCount=10")
          .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body).toHaveProperty("data");
  });

  it("GET /api/product/get-product-by-id (should get product details)", async () => {
      const res = await request(app)
          .get(`/api/product/get-product-by-id?productId=${productId}`)
          .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty("user");
  });

  it("PUT /api/product/update-product (should update user's product)", async () => {
      const res = await request(app)
        .put("/api/product/update-product")
        .send({
          productId: `${productId}`,
          name: "Samsung B1",
          quantity: 1,
          unitPrice: 740000,
          description: "A samsung galaxy B1 phone"
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.unitPrice).toBe(740000);
  });

  it("PUT /api/product/update-product (should not update a product that belongs to another user)", async () => {
      const res = await request(app)
        .put("/api/product/update-product")
        .send({
          productId: `${productId2}`,
          name: "Samsung B1",
          quantity: 1,
          unitPrice: 740000,
          description: "A samsung galaxy B1 phone"
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toMatch("Product does not belong to the user");
  });

  it("DELETE /api/product/delete-product (should delete user's own product)", async () => {
      const res = await request(app)
        .delete("/api/product/delete-product")
        .send({
          productId: `${productId}`,
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/product/delete-product (should not delete a product that belongs to another user)", async () => {
      const res = await request(app)
        .delete("/api/product/delete-product")
        .send({
          productId: `${productId2}`,
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toMatch("Product does not belong to the user");
  });

  it("DELETE /api/product/delete-multiple-products (should delete multiple products belonging to the user)", async () => {
      const res = await request(app)
        .delete("/api/product/delete-multiple-products")
        .send({
          arrayOfProductIds: [`${productId3}`, `${productId4}`],
        })
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
  });
});