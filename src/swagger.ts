import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rest API",
      version: "2.0.0",
      description: "REST API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    }
  },
  apis: process.env.NODE_ENV === "production" ? ["./dist/routes/*.js"] : ["./src/routes/*.ts"],
});
