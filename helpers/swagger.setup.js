const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" ? "https://social-media-api-497w.onrender.com/" : "http://localhost:8080",
      },
    ],
  },
  // Path to the API docs
  apis: ["./routes/*.js"], // files containing annotations for the OpenAPI Specification
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
