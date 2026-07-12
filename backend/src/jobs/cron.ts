import cron from 'node-cron';
import { prisma } from '../prisma/client';
import { logger } from '../logger';
import { QueueHelper } from '../queues/notification.queue';

export const initCronJobs = () => {
  logger.info('⏰ Initializing Background Cron Schedules...');

  // 1. Daily at 02:00 AM: Expired & Near-Expiry Inventory Audit
  cron.schedule('0 2 * * *', async () => {
    logger.info('🔍 [CRON JOB: INVENTORY AUDIT] Starting daily check for near-expiry and out-of-stock batches...');
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      const expiringBatches = await prisma.medicineBatch.findMany({
        where: {
          expiryDate: { lte: thirtyDaysFromNow },
          quantity: { gt: 0 },
        },
        include: {
          inventory: {
            include: {
              medicine: true,
              store: true,
            },
          },
        },
      });

      if (expiringBatches.length > 0) {
        logger.warn(`⚠️ [CRON AUDIT] Found ${expiringBatches.length} medicine batches expiring within 30 days!`);
        // Notify Pharmacy Admins
        const pharmacyAdmins = await prisma.user.findMany({
          where: { role: 'PHARMACY_ADMIN', deletedAt: null },
          select: { id: true, email: true },
        });

        for (const admin of pharmacyAdmins) {
          await QueueHelper.dispatchNotification({
            userId: admin.id,
            title: '⚠️ Inventory Alert: Batches Near Expiry',
            body: `${expiringBatches.length} active stock batches across stores will expire in < 30 days. Please review store inventory.`,
            channel: 'PUSH',
          });
        }
      } else {
        logger.info('✅ [CRON AUDIT] All active medicine batches have > 30 days shelf life.');
      }
    } catch (error) {
      logger.error('❌ [CRON JOB: INVENTORY AUDIT] Error:', error);
    }
  });

  // 2. Daily at 03:00 AM: Expired Refresh Token Pruning (Cleanup Queue)
  cron.schedule('0 3 * * *', async () => {
    logger.info('🧹 [CRON JOB: TOKEN CLEANUP] Starting purge of expired and revoked refresh tokens...');
    try {
      const deleted = await prisma.refreshToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { isRevoked: true },
          ],
        },
      });
      logger.info(`✅ [CRON JOB: TOKEN CLEANUP] Purged ${deleted.count} obsolete refresh tokens.`);
    } catch (error) {
      logger.error('❌ [CRON JOB: TOKEN CLEANUP] Error:', error);
    }
  });

  logger.info('✅ Cron Jobs scheduled successfully.');
};
