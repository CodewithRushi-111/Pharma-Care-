import { prisma } from '../../prisma/client';
import { TriageLevel } from '../../constants';

export class AiRepository {
  public static async getOrCreateConversation(patientId: string, conversationId?: string, contextType: string = 'GENERAL_TRIAGE') {
    if (conversationId) {
      const existing = await prisma.aiConversation.findFirst({
        where: { id: conversationId, patientId },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
      });
      if (existing) return existing;
    }

    return prisma.aiConversation.create({
      data: {
        patientId,
        contextType,
        sessionTitle: `Medical Assistant (${new Date().toLocaleDateString()})`,
      },
      include: { messages: true },
    });
  }

  public static async createMessageTransaction(data: {
    conversationId: string;
    patientId: string;
    userMessage: string;
    aiResponseContent: string;
    promptTokens: number;
    completionTokens: number;
    modelUsed: string;
    latencyMs: number;
    highestTriageLevel?: TriageLevel;
    safetyStatus?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.aiMessage.create({
        data: {
          conversationId: data.conversationId,
          senderType: 'USER',
          content: data.userMessage,
        },
      });

      const aiMsg = await tx.aiMessage.create({
        data: {
          conversationId: data.conversationId,
          senderType: 'AI',
          content: data.aiResponseContent,
          promptTokens: data.promptTokens,
          completionTokens: data.completionTokens,
          modelUsed: data.modelUsed,
          latencyMs: data.latencyMs,
        },
      });

      await tx.aiConversation.update({
        where: { id: data.conversationId },
        data: {
          highestTriageLevel: data.highestTriageLevel || 'LOW',
          safetyStatus: data.safetyStatus || 'SAFE',
          updatedAt: new Date(),
        },
      });

      return aiMsg;
    });
  }

  public static async logEmergencyIntercept(data: {
    conversationId: string;
    patientId: string;
    detectedSymptom: string;
    actionTaken: string;
    userMessageContent: string;
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.aiMessage.create({
        data: {
          conversationId: data.conversationId,
          senderType: 'USER',
          content: data.userMessageContent,
        },
      });

      const aiMsg = await tx.aiMessage.create({
        data: {
          conversationId: data.conversationId,
          senderType: 'SYSTEM',
          content: data.actionTaken,
          modelUsed: 'SAFETY_INTERCEPTOR_V1',
          latencyMs: 3, // Sub-10ms emergency triage
        },
      });

      await tx.emergencyLog.create({
        data: {
          conversationId: data.conversationId,
          patientId: data.patientId,
          detectedSymptom: data.detectedSymptom,
          triageLevel: 'EMERGENCY',
          actionTaken: data.actionTaken,
        },
      });

      await tx.aiConversation.update({
        where: { id: data.conversationId },
        data: {
          highestTriageLevel: 'EMERGENCY',
          safetyStatus: 'EMERGENCY_INTERCEPTED',
          updatedAt: new Date(),
        },
      });

      return aiMsg;
    });
  }

  public static async getPatientHistoryContext(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        medicalHistory: true,
        allergies: true,
      },
    });
    return patient;
  }
}
