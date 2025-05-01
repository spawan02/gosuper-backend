import swaggerJSDoc from 'swagger-jsdoc';
import YAML from 'yamljs';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import path from "path"

const swaggerDocument = YAML.load(path.join(__dirname,'swagger.yaml'));  

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API documentation for managing gadgets in the inventory.',
    },
    servers: [
      {
        url: 'http://localhost/3000',
        description: 'Production server on Railway',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export const setupSwaggerDocs = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));  
};
