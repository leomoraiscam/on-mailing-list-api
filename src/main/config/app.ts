import express from 'express';
import setupMiddleware  from './middleware';
import setupRoute from '../config/routes';

const app = express();
setupMiddleware(app);
setupRoute(app);

export default app;