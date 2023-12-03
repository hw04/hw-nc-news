const express = require("express");
const cors = require("cors");
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticleList,
  getArticleComments,
  postComment,
  deleteComment,
  patchVotes,
} = require("./controllers/controller");

const { getUsers } = require("./controllers/users-controllers");

const {
  handle400Errors,
  handleCustomErrors,
  handle500Error,
} = require("./controllers/error-controllers");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticleList);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use(handle400Errors);

app.use(handleCustomErrors);

app.use(handle500Error);

module.exports = app;
