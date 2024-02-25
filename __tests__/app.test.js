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

// describe("", () => {});
// test("", () => {});

describe("API", () => {
  describe("Route: /api/", () => {
    describe("Method: GET", () => {
      describe("200: Get endpoint list", () => {
        test("200: Returns the object from endpoints.json", () => {
          return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
              expect(endPoint).toEqual(body);
            });
        });
      });
    });
  });
});

describe("Model: Topics", () => {
  describe("Route: /api/topics", () => {
    describe("Method: GET", () => {
      describe("Get all topics", () => {
        test("App request should return an array of topics", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              body.forEach((topic) => {
                expect(topic).toHaveProperty("slug", expect.any(String));
                expect(topic).toHaveProperty("description", expect.any(String));
              });
              expect(body).toHaveLength(3);
            });
        });
      });
    });
  });
});

describe("Model: Articles", () => {
  describe("Route: /api/articles", () => {
    describe("Method: GET", () => {
      describe("Get article list", () => {
        test("200: Returns an array of article objects with the right properties", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(13);
              body.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
                expect(article).toHaveProperty("comment_count");
                expect(article).not.toHaveProperty("body");
              });
            });
        });
        test("200: Returns article list with a default sort of date descending", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        test("200: Returns filtered articles when passed a valid topic query", () => {
          return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(1);
              body.forEach((article) => {
                expect(article).toHaveProperty("topic", "cats");
              });
            });
        });
        test("200: Returns an empty array when a valid topic query is passed but no articles are associated with that topic", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(0);
            });
        });
        test("404: Returns an appropriate error message when an invalid topic query is passed", () => {
          return request(app)
            .get("/api/articles?topic=randomtopicnothere")
            .expect(404)
            .then(({ body }) =>
              expect(body.msg).toBe("404: Topic doesn't exist")
            );
        });
        test("200: Returns sorted articles when a sort_by query is passed and defaults to descending (no order_by query)", () => {
          return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("title", { descending: true });
            });
        });
        test("200: Returns sorted articles when a sort_by query is passed and order_by query = desc", () => {
          return request(app)
            .get("/api/articles?sort_by=author&order_by=desc")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("author", { descending: true });
            });
        });
        test("200: Responds with an array of articles sorted by title ascending (order_by query = asc)", () => {
          return request(app)
            .get("/api/articles?sort_by=title&order_by=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("title", { descending: false });
            });
        });
        test("200: Responds with an array of articles sorted by votes ascending (order_by query = asc)", () => {
          return request(app)
            .get("/api/articles?sort_by=votes&order_by=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("votes", { descending: false });
            });
        });
        test("200: Ignores case", () => {
          return request(app)
            .get("/api/articles?sort_by=TITLE&order_by=ASC")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("title", { descending: false });
            });
        });
        test("400: Rejects a sort_by query that isn't title, author, created_at, or votes", () => {
          return request(app)
            .get("/api/articles?sort_by=apple")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Invalid sort query");
            });
        });
        test("400: Rejects an order_by query that isn't asc or desc", () => {
          return request(app)
            .get("/api/articles?sort_by=author&order_by=bigtosmall")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Invalid order query");
            });
        });
        test("200: Limits returned articles if limit query is present", () => {
          return request(app)
            .get("/api/articles?limit=10")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.length).toBe(10);
              body.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
                expect(article).toHaveProperty("comment_count");
                expect(article).not.toHaveProperty("body");
              });
            });
        });
        test("200: Returns all articles if limit query is greater than the total number of articles", () => {
          return request(app)
            .get("/api/articles?limit=60")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.length).toBe(13);
              body.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
                expect(article).toHaveProperty("comment_count");
                expect(article).not.toHaveProperty("body");
              });
            });
        });
        test("400: Responds with an error if limit query is invalid", () => {
          return request(app)
            .get("/api/articles?limit=bronze")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("200: Returns the correct page of results if p query is present", () => {
          return request(app)
            .get("/api/articles?limit=5&p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.length).toBe(5);
              body.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
                expect(article).toHaveProperty("comment_count");
                expect(article).toHaveProperty("total_count");
                expect(article).not.toHaveProperty("body");
              });
              expect(body[0]).toEqual({
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                created_at: "2020-08-03T13:14:00.000Z",
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                comment_count: 2,
                total_count: 13,
              });
              expect(body[4]).toEqual({
                article_id: 4,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: 9000,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                comment_count: 0,
                total_count: 13,
              });
            });
        });
        test("200: Applies the default limit if one isn't provided and p query is present", () => {
          return request(app)
            .get("/api/articles?p=1")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(10);
            })
            .then(() => {
              return request(app).get("/api/articles?p=2").expect(200);
            })
            .then(({ body }) => {
              expect(body.length).toBe(3);
            });
        });
        test("200: Returns an empty array if the page number is greater than the available pages", () => {
          return request(app)
            .get("/api/articles?p=12")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(0);
            });
        });
        test("400: Responds with an error if p is less than 1", () => {
          return request(app)
            .get("/api/articles?limit=5&p=-1")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
      });
    });
    describe("Method: POST", () => {
      describe("Post a new article", () => {
        test("201: Posts an article and responds with the newly added article", () => {
          const newArticle = {
            author: "icellusedkars",
            title: "Original article title",
            body: "Original article body",
            topic: "mitch",
            article_img_url:
              "https://st2.depositphotos.com/3259079/5279/v/450/depositphotos_52796051-stock-illustration-the-original-rubber-stamp-red.jpg",
          };
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) =>
              expect(body).toEqual({
                author: "icellusedkars",
                title: "Original article title",
                body: "Original article body",
                topic: "mitch",
                article_img_url:
                  "https://st2.depositphotos.com/3259079/5279/v/450/depositphotos_52796051-stock-illustration-the-original-rubber-stamp-red.jpg",
                article_id: 14,
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0,
              })
            );
        });
        test("201: Ignores extra properties", () => {
          const newArticle = {
            author: "icellusedkars",
            title: "Original article title",
            body: "Original article body",
            topic: "mitch",
            article_img_url:
              "https://st2.depositphotos.com/3259079/5279/v/450/depositphotos_52796051-stock-illustration-the-original-rubber-stamp-red.jpg",
            fruit: "kiwi",
            style: "art deco",
          };
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) =>
              expect(body).toEqual({
                author: "icellusedkars",
                title: "Original article title",
                body: "Original article body",
                topic: "mitch",
                article_img_url:
                  "https://st2.depositphotos.com/3259079/5279/v/450/depositphotos_52796051-stock-illustration-the-original-rubber-stamp-red.jpg",
                article_id: 14,
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0,
              })
            );
        });
        test("201: Uses a default image if a URL isn't provided", () => {
          const newArticle = {
            author: "icellusedkars",
            title: "Original article title",
            body: "Original article body",
            topic: "mitch",
            article_img_url: "",
          };
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) =>
              expect(body).toEqual({
                author: "icellusedkars",
                title: "Original article title",
                body: "Original article body",
                topic: "mitch",
                article_img_url:
                  "https://www.nccpimandtip.gov.eg/uploads/newsImages/1549208279-default-news.png",
                article_id: 14,
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0,
              })
            );
        });
        test("201: Uses a default image if an invalid URL is detected", () => {
          const newArticle = {
            author: "icellusedkars",
            title: "Original article title",
            body: "Original article body",
            topic: "mitch",
            article_img_url: "https://www.testurl.com/notanimage",
          };
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) =>
              expect(body).toEqual({
                author: "icellusedkars",
                title: "Original article title",
                body: "Original article body",
                topic: "mitch",
                article_img_url:
                  "https://www.nccpimandtip.gov.eg/uploads/newsImages/1549208279-default-news.png",
                article_id: 14,
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0,
              })
            );
        });
        test("400: Responds with an error message when passed an invalid author", () => {
          const newArticle = {
            author: "simplyinvalid",
            title: "Not so original title",
            body: "Not so original body",
            topic: "mitch",
            article_img_url:
              "https://st2.depositphotos.com/3259079/5279/v/450/depositphotos_52796051-stock-illustration-the-original-rubber-stamp-red.jpg",
          };
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Invalid author!");
            });
        });
        test("400: Responds with an error message when passed an invalid topic", () => {
          const newArticle = {
            author: "butter_bridge",
            title: "Silver is the new gold",
            body: "Platinum",
            topic: "materials",
            article_img_url:
              "https://st2.depositphotos.com/3259079/5279/v/450/depositphotos_52796051-stock-illustration-the-original-rubber-stamp-red.jpg",
          };
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Invalid topic!");
            });
        });
        test("400: Responds with an error message when body is missing information", () => {
          const newArticle = {
            author: "butter_bridge",
            title: "Test",
          };
          return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
      });
    });
  });
  describe("Route: /api/articles/:article_id", () => {
    describe("Method: GET", () => {
      describe("Get article by ID", () => {
        test("200: A request for a particular id should return an article object with the correct properties", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                author: "butter_bridge",
                body: "I find this existence challenging",
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                topic: "mitch",
                votes: 100,
                created_at: "2020-07-09T20:11:00.000Z",
                comment_count: 11,
              });
            });
        });
        test("400: Responds with an error message when passed an invalid article ID", () => {
          return request(app)
            .get("/api/articles/invalidID")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("404: Responds with an error message when passed a valid article ID but the article doesn't exist", () => {
          return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("404: Article doesn't exist");
            });
        });
      });
    });
    describe("Method: POST", () => {
      describe("Post a new comment", () => {
        test("201: Responds with the comment object that has been sent", () => {
          const newComment = {
            username: "butter_bridge",
            body: "This is a comment",
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
        test("400: Responds with an error message when passed an invalid article ID", () => {
          const newComment = {
            username: "butter_bridge",
            body: "This is a comment",
          };
          return request(app)
            .post("/api/articles/invalidID/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("404: Responds with an error message when passed a valid article ID but the article doesn't exist", () => {
          const newComment = {
            username: "butter_bridge",
            body: "This is a comment",
          };
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
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("400: Responds with an error message when passed an invalid username", () => {
          const newComment = { username: "user123", body: "ABC" };
          return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Invalid username!");
            });
        });
      });
    });
    describe("Method: PATCH", () => {
      describe("Patch an article's votes", () => {
        test("200: Updates article votes and responds with the updated article", () => {
          const votesUpdate = { inc_votes: 50 };
          return request(app)
            .patch("/api/articles/1/")
            .send(votesUpdate)
            .expect(200)
            .then((response) => {
              const { article } = response.body;
              expect(article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 150,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        test("200: Returns the same article unaltered if inc_votes = 0", () => {
          const votesUpdate = { inc_votes: 0 };
          return request(app)
            .patch("/api/articles/1/")
            .send(votesUpdate)
            .expect(200)
            .then((response) => {
              const { article } = response.body;
              expect(article.votes).toBe(100);
            });
        });
        test("200: Works for negative votes", () => {
          const votesUpdate = { inc_votes: -200 };
          return request(app)
            .patch("/api/articles/1/")
            .send(votesUpdate)
            .expect(200)
            .then((response) => {
              const { article } = response.body;
              expect(article.votes).toBe(-100);
            });
        });
        test("200: Ignores extra properties on request body", () => {
          const votesUpdate = { inc_votes: 1, fruit: "tomato" };
          return request(app)
            .patch("/api/articles/4")
            .send(votesUpdate)
            .expect(200)
            .then((response) => {
              const { article } = response.body;
              expect(article).toEqual({
                article_id: 4,
                title: "Student SUES Mitch!",
                topic: "mitch",
                author: "rogersop",
                body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                created_at: "2020-05-06T01:14:00.000Z",
                votes: 9001,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
            });
        });
        test("400: Responds with an error message when passed an invalid article ID", () => {
          const votesUpdate = { inc_votes: 50 };
          return request(app)
            .patch("/api/articles/invalidID/")
            .send(votesUpdate)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("400: Responds with an error message if inc_votes is not a number", () => {
          const votesUpdate = { inc_votes: "@" };
          return request(app)
            .patch("/api/articles/1/")
            .send(votesUpdate)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("404: Responds with an error message when passed a valid ID but the article doesn't exist", () => {
          const votesUpdate = { inc_votes: 50 };
          return request(app)
            .patch("/api/articles/9999")
            .send(votesUpdate)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("404: Article doesn't exist");
            });
        });
      });
    });
  });
  describe("Route: /api/articles/:article_id/comments", () => {
    describe("Method: GET", () => {
      describe("Get comments by article ID", () => {
        test("200: Returns an array of comments for a given article ID, newest comments first", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(Array.isArray(body)).toBe(true);
              expect(body.length).toBe(11);
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        test("200: Returns comments with the correct properties", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              body.forEach((comment) => {
                expect(comment).toHaveProperty("article_id", 1);
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
              });
            });
        });
        test("200: Returns an empty array for an article with no comments", () => {
          return request(app)
            .get("/api/articles/7/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual([]);
            });
        });
        test("400: Responds with an error message when passed an invalid article ID", () => {
          return request(app)
            .get("/api/articles/invalidID/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("404: Responds with an error message when passed a valid article ID but the article doesn't exist", () => {
          return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("404: Article doesn't exist");
            });
        });
        test("200: Limits returned comments if limit query is present", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=5")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.length).toBe(5);
              body.forEach((comment) => {
                expect(comment).toHaveProperty("article_id", 1);
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
              });
            });
        });
        test("200: Returns all comments if limit query is greater than the total number of comments", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=50")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.length).toBe(11);
              body.forEach((comment) => {
                expect(comment).toHaveProperty("article_id", 1);
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
              });
            });
        });
        test("400: Responds with an error if limit query is invalid", () => {
          return request(app)
            .get("/api/articles/3/comments?limit=silver")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("200: Returns the correct page of results if p query is present", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=5&p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.length).toBe(5);
              body.forEach((comment) => {
                expect(comment).toHaveProperty("article_id", 1);
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
              });
              expect(body[0]).toEqual({
                comment_id: 8,
                body: "Delicious crackerbreads",
                article_id: 1,
                author: "icellusedkars",
                votes: 0,
                created_at: "2020-04-14T20:19:00.000Z",
              });
              expect(body[4]).toEqual({
                comment_id: 4,
                body: "I carry a log — yes. Is it funny to you? It is not to me.",
                article_id: 1,
                author: "icellusedkars",
                votes: -100,
                created_at: "2020-02-23T12:01:00.000Z",
              });
            });
        });
        test("200: Applies the default limit if one isn't provided and p query is present", () => {
          return request(app)
            .get("/api/articles/1/comments?p=1")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(10);
            });
        });
        test("200: Returns an empty array if the page number is greater than the number of available pages", () => {
          return request(app)
            .get("/api/articles/4/comments?p=20")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(0);
            });
        });
        test("400: Responds with an error if p is less than 1", () => {
          return request(app)
            .get("/api/articles/2/comments?limit=5&p=-1")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
      });
    });
  });
});

describe("Model: Comments", () => {
  describe("Route: /api/comments/:comment_id", () => {
    describe("Method: DELETE", () => {
      describe("Delete a comment", () => {
        test("204: Deletes the comment and responds with a 204 code and no content afterwards", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({ body }) => {
              expect(body.msg).toBe(undefined);
              return request(app)
                .get("/api/articles/9/comments")
                .expect(200)
                .then(({ body }) => {
                  expect(body.length).toBe(1);
                });
            });
        });
        test("404: Responds with an error message when passed a valid ID but the comment doesn't exist", () => {
          return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("404: Comment doesn't exist");
            });
        });
        test("400: Responds with an error message when passed an invalid comment ID", () => {
          return request(app)
            .delete("/api/comments/banana")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
      });
    });
    describe("Method: PATCH", () => {
      describe("Patch a comment's votes", () => {
        test("200: Updates comment votes and responds with the updated comment", () => {
          const votesUpdate = { inc_votes: 1 };
          return request(app)
            .patch("/api/comments/13")
            .send(votesUpdate)
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                body: "Fruit pastilles",
                votes: 1,
                author: "icellusedkars",
                article_id: 1,
                comment_id: 13,
                created_at: "2020-06-15T10:25:00.000Z",
              });
            });
        });
        test("200: Returns the same comment unaltered if inc_votes = 0", () => {
          const votesUpdate = { inc_votes: 0 };
          return request(app)
            .patch("/api/comments/13/")
            .send(votesUpdate)
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                body: "Fruit pastilles",
                votes: 0,
                author: "icellusedkars",
                article_id: 1,
                comment_id: 13,
                created_at: "2020-06-15T10:25:00.000Z",
              });
            });
        });
        test("200: Works for negative votes", () => {
          const votesUpdate = { inc_votes: -200 };
          return request(app)
            .patch("/api/comments/4")
            .send(votesUpdate)
            .expect(200)
            .then(({ body }) => {
              expect(body.votes).toBe(-300);
            });
        });
        test("200: Ignores extra properties on request body", () => {
          const votesUpdate = { inc_votes: -200, fruit: "tomato" };
          return request(app)
            .patch("/api/comments/4")
            .send(votesUpdate)
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                body: "I carry a log — yes. Is it funny to you? It is not to me.",
                votes: -300,
                author: "icellusedkars",
                article_id: 1,
                comment_id: 4,
                created_at: "2020-02-23T12:01:00.000Z",
              });
            });
        });
        test("400: Responds with an error message when passed an invalid comment ID", () => {
          const votesUpdate = { inc_votes: 50 };
          return request(app)
            .patch("/api/comments/olive/")
            .send(votesUpdate)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("400: Responds with an error message if inc_votes is not a number", () => {
          const votesUpdate = { inc_votes: "notanum" };
          return request(app)
            .patch("/api/comments/5/")
            .send(votesUpdate)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400: Bad request");
            });
        });
        test("404: Responds with an error message when passed a valid ID but the comment doesn't exist", () => {
          const votesUpdate = { inc_votes: 50 };
          return request(app)
            .patch("/api/comments/91919190")
            .send(votesUpdate)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("404: Comment doesn't exist");
            });
        });
      });
    });
  });
});

describe("Model: Users", () => {
  describe("Route: /api/users", () => {
    describe("Method: GET", () => {
      describe("Get user list", () => {
        test("200: Responds with an array", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
              expect(Array.isArray(body)).toBe(true);
            });
        });
        test("200: User objects have the correct properties", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).not.toBe(0);
              body.forEach((user) => {
                expect(user).toHaveProperty("username");
                expect(user).toHaveProperty("name");
                expect(user).toHaveProperty("avatar_url");
              });
            });
        });
      });
    });
  });
  describe("Route: /api/users/:username", () => {
    describe("Method: GET", () => {
      describe("Get individual user by id", () => {
        test("200: Responds with a user object with the correct properties", () => {
          return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              });
            });
        });
        test("404: Responds with an error when a request is made for a user that doesn't exist", () => {
          return request(app)
            .get("/api/users/imnotauser")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("404: User doesn't exist");
            });
        });
      });
    });
  });
});
