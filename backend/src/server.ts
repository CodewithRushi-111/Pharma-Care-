import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './logger';
import { checkDatabaseConnection, prisma } from './prisma/client';
import { redis } from './utils';
import { startNotificationWorkers } from './workers/notification.worker';
import { initCronJobs } from './jobs/cron';

const server = http.createServer(app);

async function bootstrap() {
  try {
    logger.info('🚀 Bootstrapping Pharma Care Enterprise Backend Architecture...');

    // 1. Verify PostgreSQL connection
    await checkDatabaseConnection();

    // 2. Verify Redis connection
    if (redis.status === 'ready' || redis.status === 'connecting' || redis.status === 'connect') {
      logger.info('✅ Redis Cache & BullMQ Queue connection verified.');
    } else {
      logger.warn('⚠️ Redis connection not yet ready. Background workers will connect asynchronously.');
    }

    // 3. Initialize BullMQ Asynchronous Consumers
    startNotificationWorkers();

    // 4. Initialize Cron Jobs
    initCronJobs();

    // 5. Start HTTP Server
    const port = env.PORT;
    server.listen(port, () => {
      logger.info(`✅ =================================================================`);
      logger.info(`✅ Pharma Care Enterprise API running on PORT: [ ${port} ]`);
      logger.info(`✅ Environment: [ ${env.NODE_ENV.toUpperCase()} ] | API Prefix: [ ${env.API_PREFIX} ]`);
      logger.info(`✅ Swagger API Docs available at: http://localhost:${port}/api-docs`);
      logger.info(`✅ System Health Check: http://localhost:${port}/health`);
      logger.info(`✅ =================================================================`);
    });
  } catch (error) {
    logger.error('❌ Fatal error during backend bootstrap:', error);
    process.exit(1);
  }
}

// Graceful Shutdown Handlers
const gracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('🔌 HTTP Server closed.');

    try {
      await prisma.$disconnect();
      logger.info('🔌 Prisma PostgreSQL Database disconnected.');

      await redis.quit();
      logger.info('🔌 Redis Cache disconnected.');

      logger.info('👋 Graceful shutdown complete. Exiting process cleanly.');
      process.exit(0);
    } catch (err) {
      logger.error('❌ Error during cleanup on shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if connections hang
  setTimeout(() => {
    logger.error('🚨 Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: any) => {
  logger.error('❌ Unhandled Rejection at Promise:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Uncaught Exception thrown:', error);
  process.exit(1);
});

bootstrap();
