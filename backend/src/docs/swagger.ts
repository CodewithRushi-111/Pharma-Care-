import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pharma Care Enterprise API Documentation',
      version: '1.0.0',
      description:
        'Production-ready Enterprise Backend Architecture for Pharma Care - AI-Powered Smart Pharmacy & Telemedicine Platform.\n\nBuilt with Node.js, Express, TypeScript, Prisma ORM (PostgreSQL), Redis, BullMQ, Google Gemini 3.1 Pro AI, and Clean Architecture.',
      contact: {
        name: 'Pharma Care Engineering Team',
        email: 'engineering@pharmacare.local',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide your JWT Access Token (Header format: `Bearer <token>`)',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication & User Identity Management (RBAC, Token Rotation, OTP)' },
      { name: 'Pharmacy', description: 'Smart Pharmacy Catalog, Cart, Prescription OCR & Distributed Checkout' },
      { name: 'Telemedicine', description: 'Doctor Directory, Slot Locking, WebRTC Video Consultation & Digital RX' },
      { name: 'AI Assistant', description: 'Google Gemini 3.1 Pro Clinical Assistant & Sub-10ms Emergency Safety Interceptor' },
      { name: 'Admin', description: 'Multi-Role Admin Portal (Doctor Verification, RX Verification, Catalog & Auditing)' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
