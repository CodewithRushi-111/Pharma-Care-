import { TelemedicineRepository } from './telemedicine.repository';
import { DoctorSearchDto, BookAppointmentDto, CompleteConsultationDto } from './telemedicine.dto';
import { AppError } from '../../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../../constants';
import { redis, CryptoHelper } from '../../utils';
import { logger } from '../../logger';
import { prisma } from '../../prisma/client';
import { env } from '../../config/env';

export class TelemedicineService {
  public static async searchDoctors(dto: DoctorSearchDto) {
    return TelemedicineRepository.searchDoctors(dto);
  }

  public static async getDoctorById(id: string) {
    const doctor = await TelemedicineRepository.findDoctorById(id);
    if (!doctor) {
      throw new AppError('Doctor profile not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
    }
    return doctor;
  }

  public static async bookAppointment(userId: string, dto: BookAppointmentDto) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      throw new AppError('Patient profile required to book an appointment.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: dto.doctorId } });
    if (!doctor || doctor.verificationStatus !== 'VERIFIED') {
      throw new AppError('Doctor not found or not currently verified.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    const lockKey = `lock:timeslot:${dto.timeSlotId}`;
    const acquired = await redis.set(lockKey, userId, 'EX', 10, 'NX');
    if (!acquired) {
      throw new AppError(
        'This time slot is currently being booked by another patient. Please select another slot or retry in 5 seconds.',
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.RATE_LIMIT_EXCEEDED
      );
    }

    try {
      const appointment = await TelemedicineRepository.bookAppointmentTransaction({
        patientId: patient.id,
        doctorId: doctor.id,
        timeSlotId: dto.timeSlotId,
        appointmentType: dto.appointmentType,
        consultationFee: Number(doctor.consultationFee),
      });

      logger.info(`📅 Appointment Booked: ${appointment.id} between Patient ${patient.id} and Doctor ${doctor.id}`);
      return appointment;
    } catch (error: any) {
      if (error.message === 'SLOT_ALREADY_BOOKED') {
        throw new AppError('Selected time slot is already booked.', HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
      }
      throw error;
    } finally {
      await redis.del(lockKey);
    }
  }

  public static async generateVideoToken(userId: string, appointmentId: string) {
    const appointment = await TelemedicineRepository.findAppointmentById(appointmentId);
    if (!appointment) {
      throw new AppError('Appointment not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    const isPatient = appointment.patient.userId === userId;
    const isDoctor = appointment.doctor.userId === userId;
    if (!isPatient && !isDoctor) {
      throw new AppError('You are not authorized to join this video consultation.', HTTP_STATUS.FORBIDDEN, ERROR_CODES.PERMISSION_DENIED);
    }

    if (!appointment.videoSession) {
      throw new AppError('Video session not initialized for this appointment.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    // In a real Twilio setup, we use twilio.jwt.AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET)
    // Here we generate an enterprise JWT signaling token signed with HMAC for WebRTC connection
    const identity = isDoctor ? `dr_${appointment.doctor.id}` : `patient_${appointment.patient.id}`;
    const roomName = appointment.videoSession.roomName;

    const mockTwilioToken = `SignalingToken.${CryptoHelper.hashToken(`${identity}:${roomName}:${env.JWT_SECRET}`).slice(0, 32)}`;

    await prisma.videoSession.update({
      where: { id: appointment.videoSession.id },
      data: { startedAt: appointment.videoSession.startedAt || new Date() },
    });

    return {
      roomName,
      identity,
      token: mockTwilioToken,
      provider: 'TWILIO_WEBRTC',
    };
  }

  public static async completeConsultation(doctorUserId: string, appointmentId: string, dto: CompleteConsultationDto) {
    const doctor = await prisma.doctor.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) {
      throw new AppError('Doctor profile required.', HTTP_STATUS.FORBIDDEN, ERROR_CODES.PERMISSION_DENIED);
    }

    const appointment = await TelemedicineRepository.findAppointmentById(appointmentId);
    if (!appointment || appointment.doctorId !== doctor.id) {
      throw new AppError('Appointment not found or not assigned to you.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    const prescriptionNumber = CryptoHelper.generatePrescriptionNumber();
    const qrVerificationCode = `VERIFY-QR-${CryptoHelper.hashToken(prescriptionNumber).slice(0, 16).toUpperCase()}`;

    const result = await TelemedicineRepository.completeConsultationAndIssuePrescription({
      appointmentId,
      doctorId: doctor.id,
      patientId: appointment.patientId,
      chiefComplaint: dto.chiefComplaint,
      diagnosis: dto.diagnosis,
      clinicalNotes: dto.clinicalNotes,
      followUpDate: dto.followUpDate,
      prescriptionNumber,
      qrVerificationCode,
      items: dto.prescriptionItems,
    });

    logger.info(`📝 Consultation completed & Digital Prescription issued: ${prescriptionNumber}`);
    return result;
  }
}
