const express = require("express");
const app = express();
const cors = require("cors");
const api = require("./routes/api-router");

const {
  handle400Errors,
  handleCustomErrors,
  handle500Error,
} = require("./controllers/error-controllers");

app.use(cors());
app.use(express.json());

app.use("/api", api);

app.use(handle400Errors);
app.use(handleCustomErrors);
app.use(handle500Error);

module.exports = app;
