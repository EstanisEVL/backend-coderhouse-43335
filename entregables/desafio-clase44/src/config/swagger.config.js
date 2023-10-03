export const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Swagger OPEN API - Desafío complementario",
      description: "Documentación del desafío complementario de la clase 44",
      version: "1.0.1"
    }
  },
  apis: [`./src/docs/**/*.yml`],
};
