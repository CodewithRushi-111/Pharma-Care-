import { Queue, QueueOptions } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../logger';

const connectionOptions: any = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
};

if (env.REDIS_HOST !== 'localhost' && env.REDIS_HOST !== '127.0.0.1') {
  connectionOptions.tls = { rejectUnauthorized: false };
}

const queueOptions: QueueOptions = {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days (Dead Letter queue inspection)
    },
  },
};

export const notificationQueue = new Queue('notificationQueue', queueOptions);
export const emailQueue = new Queue('emailQueue', queueOptions);
export const smsQueue = new Queue('smsQueue', queueOptions);
export const cleanupQueue = new Queue('cleanupQueue', queueOptions);

notificationQueue.on('error', (err) => logger.error(`❌ BullMQ notificationQueue error: ${err instanceof Error ? err.message : String(err)}`));
emailQueue.on('error', (err) => logger.error(`❌ BullMQ emailQueue error: ${err instanceof Error ? err.message : String(err)}`));
smsQueue.on('error', (err) => logger.error(`❌ BullMQ smsQueue error: ${err instanceof Error ? err.message : String(err)}`));
cleanupQueue.on('error', (err) => logger.error(`❌ BullMQ cleanupQueue error: ${err instanceof Error ? err.message : String(err)}`));

export class QueueHelper {
  public static async dispatchEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await emailQueue.add('sendEmail', data);
    logger.info(`📧 Job dispatched to emailQueue for: ${data.to}`);
  }

  public static async dispatchSms(data: {
    phoneNumber: string;
    message: string;
    priority?: boolean;
  }): Promise<void> {
    const opts = data.priority ? { priority: 1 } : {};
    await smsQueue.add('sendSms', data, opts);
    logger.info(`📱 Job dispatched to smsQueue for: ${data.phoneNumber}`);
  }

  public static async dispatchNotification(data: {
    userId: string;
    title: string;
    body: string;
    actionUrl?: string;
    channel?: 'PUSH' | 'EMAIL' | 'SMS';
  }): Promise<void> {
    await notificationQueue.add('sendNotification', data);
    logger.info(`🔔 Job dispatched to notificationQueue for User: ${data.userId}`);
  }
}
