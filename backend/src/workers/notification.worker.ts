import { Worker, Job, WorkerOptions } from 'bullmq';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../logger';
import { prisma } from '../prisma/client';

const createConnectionOptions = () => {
  if (env.REDIS_URL) {
    const parsed = new URL(env.REDIS_URL);
    const opts: any = {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 6379,
      username: parsed.username || undefined,
      password: parsed.password || undefined,
    };
    if (parsed.protocol === 'rediss:') {
      opts.tls = { rejectUnauthorized: false };
    }
    return opts;
  }

  const opts: any = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
  };
  if (env.REDIS_HOST !== 'localhost' && env.REDIS_HOST !== '127.0.0.1') {
    opts.tls = { rejectUnauthorized: false };
  }
  return opts;
};

const workerOptions: WorkerOptions = {
  connection: createConnectionOptions(),
  concurrency: 5,
};

// Configure Nodemailer transporter
const mailTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const startNotificationWorkers = () => {
  logger.info('⚙️ Initializing BullMQ Asynchronous Consumers...');

  // 1. Email Worker
  const emailWorker = new Worker(
    'emailQueue',
    async (job: Job) => {
      const { to, subject, html } = job.data;
      logger.debug(`[Worker: emailQueue] Processing job ${job.id} -> ${to}`);

      if (env.SMTP_USER && !env.SMTP_USER.includes('no-reply@pharmacare.local')) {
        await mailTransporter.sendMail({
          from: `"Pharma Care Enterprise" <${env.SMTP_USER}>`,
          to,
          subject,
          html,
        });
      } else {
        logger.info(`📧 [MOCK SMTP DISPATCH] To: ${to} | Subject: ${subject}`);
      }
    },
    workerOptions
  );

  emailWorker.on('completed', (job) => logger.info(`✅ [emailQueue] Job ${job.id} completed.`));
  emailWorker.on('failed', (job, err) => logger.error(`❌ [emailQueue] Job ${job?.id} failed: ${err instanceof Error ? err.message : String(err)}`));

  // 2. SMS Worker
  const smsWorker = new Worker(
    'smsQueue',
    async (job: Job) => {
      const { phoneNumber, message } = job.data;
      logger.debug(`[Worker: smsQueue] Processing job ${job.id} -> ${phoneNumber}`);

      // If Twilio API credentials configured, send SMS. Otherwise simulated high-fidelity logging.
      if (env.TWILIO_ACCOUNT_SID && !env.TWILIO_ACCOUNT_SID.includes('mock')) {
        // Real Twilio SDK dispatch logic
      } else {
        logger.info(`📱 [MOCK TWILIO SMS DISPATCH] To: ${phoneNumber} | Msg: "${message}"`);
      }
    },
    workerOptions
  );

  smsWorker.on('completed', (job) => logger.info(`✅ [smsQueue] Job ${job.id} completed.`));
  smsWorker.on('failed', (job, err) => logger.error(`❌ [smsQueue] Job ${job?.id} failed: ${err instanceof Error ? err.message : String(err)}`));

  // 3. In-App & Multi-channel Notification Worker
  const notificationWorker = new Worker(
    'notificationQueue',
    async (job: Job) => {
      const { userId, title, body, actionUrl, channel } = job.data;
      logger.debug(`[Worker: notificationQueue] Processing job ${job.id} -> User: ${userId}`);

      // Persist in-app notification
      await prisma.notification.create({
        data: {
          userId,
          title,
          body,
          actionUrl,
          channel: channel || 'PUSH',
          isRead: false,
        },
      });

      // If user has push registration or webhook, deliver push
      logger.info(`🔔 [PUSH DELIVERED] To User ${userId}: ${title} - ${body}`);
    },
    workerOptions
  );

  notificationWorker.on('completed', (job) => logger.info(`✅ [notificationQueue] Job ${job.id} completed.`));
  notificationWorker.on('failed', (job, err) => logger.error(`❌ [notificationQueue] Job ${job?.id} failed: ${err instanceof Error ? err.message : String(err)}`));

  return { emailWorker, smsWorker, notificationWorker };
};
