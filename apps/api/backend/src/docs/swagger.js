const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TestTrack Pro API",
      version: "1.0.0",
      description: "API documentation for TestTrack Pro"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: ["./src/routes/*.js"] // scan route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;