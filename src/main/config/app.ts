import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../swagger.json';
import setupMiddleware from './middleware';
import setupRoute from './routes';

const app = express();
setupMiddleware(app);
setupRoute(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
