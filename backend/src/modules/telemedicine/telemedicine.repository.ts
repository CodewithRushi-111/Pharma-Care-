import { prisma } from '../../prisma/client';
import { Prisma } from '@prisma/client';
import { DoctorSearchDto } from './telemedicine.dto';

export class TelemedicineRepository {
  public static async searchDoctors(dto: DoctorSearchDto) {
    const where: Prisma.DoctorWhereInput = {
      verificationStatus: 'VERIFIED',
    };

    if (dto.specialization) {
      where.specialization = { contains: dto.specialization, mode: 'insensitive' };
    }

    if (dto.maxFee !== undefined) {
      where.consultationFee = { lte: dto.maxFee };
    }

    let orderBy: Prisma.DoctorOrderByWithRelationInput = {};
    if (dto.sortBy === 'fee_asc') orderBy = { consultationFee: 'asc' };
    else if (dto.sortBy === 'fee_desc') orderBy = { consultationFee: 'desc' };
    else orderBy = { experienceYears: 'desc' };

    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          user: { select: { email: true, phoneNumber: true } },
          availability: true,
          timeSlots: {
            where: { isBooked: false, startTime: { gte: new Date() } },
            take: 10,
            orderBy: { startTime: 'asc' },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.doctor.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  public static async findDoctorById(id: string) {
    return prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, phoneNumber: true } },
        availability: true,
        timeSlots: {
          where: { isBooked: false, startTime: { gte: new Date() } },
          orderBy: { startTime: 'asc' },
        },
      },
    });
  }

  public static async bookAppointmentTransaction(data: {
    patientId: string;
    doctorId: string;
    timeSlotId: string;
    appointmentType: string;
    consultationFee: number;
  }) {
    return prisma.$transaction(async (tx) => {
      const slot = await tx.timeSlot.findUnique({ where: { id: data.timeSlotId } });
      if (!slot || slot.isBooked) {
        throw new Error('SLOT_ALREADY_BOOKED');
      }

      await tx.timeSlot.update({
        where: { id: data.timeSlotId },
        data: { isBooked: true },
      });

      const appointment = await tx.appointment.create({
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          timeSlotId: data.timeSlotId,
          appointmentType: data.appointmentType,
          status: 'SCHEDULED',
          consultationFee: data.consultationFee,
        },
        include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } },
          timeSlot: true,
        },
      });

      await tx.videoSession.create({
        data: {
          appointmentId: appointment.id,
          roomName: `ROOM-${appointment.id}`,
          provider: 'TWILIO',
        },
      });

      return appointment;
    });
  }

  public static async findAppointmentById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
        timeSlot: true,
        videoSession: true,
        consultation: { include: { digitalPrescription: { include: { items: true } } } },
      },
    });
  }

  public static async completeConsultationAndIssuePrescription(data: {
    appointmentId: string;
    doctorId: string;
    patientId: string;
    chiefComplaint: string;
    diagnosis: string;
    clinicalNotes?: string;
    followUpDate?: Date;
    prescriptionNumber: string;
    qrVerificationCode: string;
    items: {
      medicineName: string;
      dosage: string;
      frequency: string;
      durationDays: number;
      instructions?: string;
    }[];
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: data.appointmentId },
        data: { status: 'COMPLETED' },
      });

      const consultation = await tx.consultation.create({
        data: {
          appointmentId: data.appointmentId,
          doctorId: data.doctorId,
          patientId: data.patientId,
          chiefComplaint: data.chiefComplaint,
          diagnosis: data.diagnosis,
          clinicalNotes: data.clinicalNotes,
          followUpDate: data.followUpDate,
        },
      });

      let digitalPrescription = null;
      if (data.items.length > 0) {
        digitalPrescription = await tx.digitalPrescription.create({
          data: {
            consultationId: consultation.id,
            prescriptionNumber: data.prescriptionNumber,
            qrVerificationCode: data.qrVerificationCode,
            items: {
              create: data.items.map((item) => ({
                medicineName: item.medicineName,
                dosage: item.dosage,
                frequency: item.frequency,
                durationDays: item.durationDays,
                instructions: item.instructions,
              })),
            },
          },
          include: { items: true },
        });
      }

      return { consultation, digitalPrescription };
    });
  }
}
