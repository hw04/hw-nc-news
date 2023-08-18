const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/");
const endPoint = require("../endpoints.json");
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

describe("Get API", () => {
  test("API request should return the object from endpoints.json", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((result) => {
        expect(endPoint).toEqual(result.body);
      });
  });
});

describe("Get article by ID", () => {
  test("A request for a particular id should return an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveProperty("article_id", 1);
        expect(result.body).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(result.body).toHaveProperty("author", "butter_bridge");
        expect(result.body).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(result.body).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(result.body).toHaveProperty("topic", "mitch");
        expect(result.body).toHaveProperty("votes", 100);
        expect(result.body).toHaveProperty("created_at");
      });
  });
  test("A request for a particular id should return an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveProperty("article_id", 7);
        expect(result.body).toHaveProperty("title", "Z");
        expect(result.body).toHaveProperty("author", "icellusedkars");
        expect(result.body).toHaveProperty("body", "I was hungry.");
        expect(result.body).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(result.body).toHaveProperty("topic", "mitch");
        expect(result.body).toHaveProperty("votes", 0);
        expect(result.body).toHaveProperty("created_at");
      });
  });
  test("400: Responds with an error message when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/invalidID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: ID invalid");
      });
  });
  test("404: Responds with an error message when passed a valid ID who's article doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article doesn't exist");
      });
  });
});

describe("Post comment", () => {
  test("201: Responds with the comment object that has been sent", () => {
    const newComment = { username: "butter_bridge", body: "This is a comment" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment.body).toEqual("This is a comment");
        expect(comment.author).toEqual("butter_bridge");
        expect(comment.article_id).toEqual(1);
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("comment_id");
      });
  });
  test("201: Ignores extra properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a comment",
      fruit: "apple",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment.body).toEqual("This is a comment");
        expect(comment.author).toEqual("butter_bridge");
        expect(comment.article_id).toEqual(1);
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("comment_id");
      });
  });
  test("400: Responds with an error message when passed a comment with an invalid ID", () => {
    const newComment = { username: "butter_bridge", body: "This is a comment" };
    return request(app)
      .post("/api/articles/invalidID/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: ID invalid");
      });
  });
  test("404: Responds with an error message when passed a comment with a valid ID but who's article doesn't exist", () => {
    const newComment = { username: "butter_bridge", body: "This is a comment" };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article doesn't exist");
      });
  });
  test("400: Responds with an error message when passed an empty comment", () => {
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Field cannot be empty!");
      });
  });
  test("400: Responds with an error message when passed an invalid username", () => {
    const newComment = { username: "user123", body: "ABC" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Invalid username");
      });
  });
});

describe.only("Patch an article", () => {
  test("200: Responds with the updated article", () => {
    const newUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1/")
      .send(newUpdate)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.votes).toBe(150);
      });
  });

  test("200: Returns the same article unaltered if inc_votes = 0", () => {
    const newUpdate = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/1/")
      .send(newUpdate)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.votes).toBe(100);
      });
  });

  test.only("200: Works for negative votes", () => {
    const newUpdate = { inc_votes: -200 };
    return request(app)
      .patch("/api/articles/1/")
      .send(newUpdate)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.votes).toBe(-100);
      });
  });

  test("400: Responds with an error message when passed an invalid ID", () => {
    const newUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/invalidID/")
      .send(newUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: ID invalid");
      });
  });
  test("404: Responds with an error message when passed a valid ID but the article doesn't exist", () => {
    const newUpdate = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/9999")
      .send(newUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article doesn't exist");
      });
  });
});
