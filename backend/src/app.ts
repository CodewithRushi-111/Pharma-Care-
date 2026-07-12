import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { morganMiddleware } from './logger';
import { errorHandler } from './middlewares/error.middleware';
import { swaggerSpec } from './docs/swagger';
import { HTTP_STATUS } from './constants';
import { ResponseHelper } from './helpers/response.helper';

// Import domain module routes
import authRoutes from './modules/auth/auth.routes';
import pharmacyRoutes from './modules/pharmacy/pharmacy.routes';
import telemedicineRoutes from './modules/telemedicine/telemedicine.routes';
import aiRoutes from './modules/ai/ai.routes';
import adminRoutes from './modules/admin/admin.routes';

const app: Express = express();

// 1. Security & Global Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  })
);

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? ['https://pharmacare.local', 'https://www.pharmacare.local'] : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morganMiddleware);

// 2. Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. System Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  ResponseHelper.success(
    res,
    {
      status: 'HEALTHY',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
    'Pharma Care Enterprise API is online and running.',
    HTTP_STATUS.OK
  );
});

// 4. Mount Domain API Routes
const prefix = env.API_PREFIX;
app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/pharmacy`, pharmacyRoutes);
app.use(`${prefix}/telemedicine`, telemedicineRoutes);
app.use(`${prefix}/ai`, aiRoutes);
app.use(`${prefix}/admin`, adminRoutes);

// 5. 404 Catch-All Handler
app.use((req: Request, res: Response) => {
  ResponseHelper.error(
    res,
    'RESOURCE_NOT_FOUND',
    `Cannot find ${req.method} ${req.originalUrl} on this server. Please check the API documentation at /api-docs.`,
    HTTP_STATUS.NOT_FOUND
  );
});

// 6. Global Error Handler
app.use(errorHandler);

export default app;
