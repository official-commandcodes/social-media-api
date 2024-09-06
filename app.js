require("dotenv").config();
const express = require("express");
const { swaggerDocs, swaggerUi } = require("./helpers/swagger.setup");
const { connectDB } = require("./helpers/db");

const app = express();

// setup swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// connect to Mongodb database
(async () => await connectDB())();

app.use("/", (req, res, next) => {
  res.end("Welcome to Social Media API.");
});

// APIs
app.use("*", (_, res) => {
  res.end("There is no such api.");
});

app.listen(8080, () => console.log("Server running in port 8080"));
