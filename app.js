const express = require("express");
const { topicsController, apiController } = require("./controllers/controller");

const app = express();

app.get("/api/topics", topicsController);

app.get("/api", apiController);

// app.listen(9090, () => console.log("App listening on port 9090!"));

module.exports = app;
