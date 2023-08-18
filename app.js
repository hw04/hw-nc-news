const express = require("express");
const {
  topicsController,
  apiController,
  addComment,
  deleteComment,
} = require("./controllers/controller");
const {
  handle400Errors,
  handleCustomErrors,
  handle500Error,
} = require("./controllers/errors.controller");
const app = express();

app.use(express.json());

app.post("/api/articles/:article_id/comments", addComment);

app.get("/api/topics", topicsController);

app.get("/api", apiController);

app.get("/api/articles/:article_id", articleIdController);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handle400Errors);

app.use(handleCustomErrors);

app.use(handle500Error);

module.exports = app;
