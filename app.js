require("dotenv").config();
const express = require("express");
const { swaggerDocs, swaggerUi } = require("./helpers/swagger.setup");
const { connectDB } = require("./helpers/db");

// Routes
const userRoutes = require("./routes/user.routes");

const app = express();

// middlewares
app.use(express.json());

// setup swagger docsn
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// connect to Mongodb database
(async () => await connectDB())();

app.use("/", (req, res, next) => {
  // res.send("<h2>Welcome to Social Media API.<h2>");
  next();
});

app.use("/api", userRoutes);

// APIs
app.use("*", (_, res) => {
  res.end("There is no such api.");
});

app.listen(8080, () => console.log("Server running in port 8080"));
