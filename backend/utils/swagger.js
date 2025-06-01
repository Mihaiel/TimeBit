// Swagger configuration
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TimeBit API',
      version: '1.0.0',
      description: 'API documentation for TimeBit.',
    },
  },
  apis: ['./backend/routes/*.js'], // Point to routes folder
};

// Generate the Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Export the function to plug into Express
export default function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
