import swaggerJSDoc from 'swagger-jsdoc';

// Swagger options
const options = {
  definition: {
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        /**
         * Uncomment if you want to use handshake token for authorization
         */
        // apiKeyAuth: {
        //   type: 'apiKey',
        //   scheme: 'bearer',
        //   name: 'X-API-KEY',
        //   in: 'header',
        // },
      },
    },
    openapi: '3.0.0',
    info: {
      title: 'Notification Service',
      version: '1.0.0',
      description: 'API documentation for notification service',
    },
    servers: [
      {
        url: '/',
      },
    ],
  },
  // Path to the API routes
  apis: ['./routes/**/*.{ts,js}'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
