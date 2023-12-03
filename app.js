const express = require("express");
const app = express();
const cors = require("cors");

// Controllers
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  getArticleList,
  patchVotes,
} = require("./controllers/articles-controllers");
const {
  getArticleComments,
  postComment,
  deleteComment,
} = require("./controllers/comments-controllers");
const { getEndpoints } = require("./controllers/api-controller");
const { getUsers } = require("./controllers/users-controllers");
const {
  handle400Errors,
  handleCustomErrors,
  handle500Error,
} = require("./controllers/error-controllers");

// Middleware
app.use(cors());
app.use(express.json());

// GET requests
app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticleList);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/users", getUsers);

// POST requests
app.post("/api/articles/:article_id/comments", postComment);

// PATCH requests
app.patch("/api/articles/:article_id", patchVotes);

// DELETE requests
app.delete("/api/comments/:comment_id", deleteComment);

// Error handling
app.use(handle400Errors);
app.use(handleCustomErrors);
app.use(handle500Error);

module.exports = app;
