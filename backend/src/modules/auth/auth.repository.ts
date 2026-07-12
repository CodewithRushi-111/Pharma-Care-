import { prisma } from '../../prisma/client';
import { UserRole } from '../../constants';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  public static async findUserByIdentifier(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phoneNumber: identifier }],
      },
      include: {
        patientProfile: true,
        doctorProfile: true,
        adminProfile: true,
      },
    });
  }

  public static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        patientProfile: true,
        doctorProfile: true,
        adminProfile: true,
      },
    });
  }

  public static async createUser(data: {
    email: string;
    phoneNumber?: string;
    passwordHash?: string;
    googleId?: string;
    role: UserRole;
    isVerified?: boolean;
    fullName?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          phoneNumber: data.phoneNumber,
          passwordHash: data.passwordHash,
          googleId: data.googleId,
          role: data.role as any,
          isVerified: data.isVerified || false,
        },
      });

      if (data.role === UserRole.PATIENT) {
        await tx.patient.create({
          data: {
            userId: user.id,
          },
        });
        await tx.cart.create({
          data: { userId: user.id },
        });
      }

      return user;
    });
  }

  public static async createRefreshToken(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
    deviceIp?: string;
    userAgent?: string;
  }) {
    return prisma.refreshToken.create({
      data: {
        tokenHash: data.tokenHash,
        userId: data.userId,
        expiresAt: data.expiresAt,
        deviceIp: data.deviceIp,
        userAgent: data.userAgent,
      },
    });
  }

  public static async findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  public static async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  public static async revokeAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  public static async verifyUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  public static async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
