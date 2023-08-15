const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/");
beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("Get topics", () => {
  test("App request should return an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        result.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
          expect(result.body).toHaveLength(3);
        });
      });
  });
});
