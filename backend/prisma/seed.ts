import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise Database Seeder for Pharma Care...');

  const defaultPasswordHash = await bcrypt.hash('Enterprise@2026', 12);

  // 1. Create Users for all 5 roles
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@pharmacare.local' },
    update: {},
    create: {
      email: 'superadmin@pharmacare.local',
      phoneNumber: '919000000001',
      passwordHash: defaultPasswordHash,
      role: 'SUPER_ADMIN',
      isVerified: true,
      twoFactorEnabled: true,
    },
  });

  const platformAdminUser = await prisma.user.upsert({
    where: { email: 'admin@pharmacare.local' },
    update: {},
    create: {
      email: 'admin@pharmacare.local',
      phoneNumber: '919000000002',
      passwordHash: defaultPasswordHash,
      role: 'PLATFORM_ADMIN',
      isVerified: true,
    },
  });

  const pharmacyAdminUser = await prisma.user.upsert({
    where: { email: 'pharmacy@pharmacare.local' },
    update: {},
    create: {
      email: 'pharmacy@pharmacare.local',
      phoneNumber: '919000000003',
      passwordHash: defaultPasswordHash,
      role: 'PHARMACY_ADMIN',
      isVerified: true,
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'dr.sharma@pharmacare.local' },
    update: {},
    create: {
      email: 'dr.sharma@pharmacare.local',
      phoneNumber: '919000000004',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      isVerified: true,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient.rahul@pharmacare.local' },
    update: {},
    create: {
      email: 'patient.rahul@pharmacare.local',
      phoneNumber: '919000000005',
      passwordHash: defaultPasswordHash,
      role: 'PATIENT',
      isVerified: true,
    },
  });

  // 2. Create Profiles
  await prisma.admin.upsert({
    where: { userId: platformAdminUser.id },
    update: {},
    create: {
      userId: platformAdminUser.id,
      department: 'Central Governance',
      accessLevel: 'FULL',
    },
  });

  await prisma.admin.upsert({
    where: { userId: pharmacyAdminUser.id },
    update: {},
    create: {
      userId: pharmacyAdminUser.id,
      department: 'Store Operations & Verification',
      accessLevel: 'PHARMACY_ONLY',
    },
  });

  const doctorProfile = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      registrationNumber: 'MCI-2018-88492',
      specialization: 'Cardiology & General Medicine',
      experienceYears: 14,
      consultationFee: 750.00,
      qualification: 'MBBS, MD (Cardiology) - AIIMS Delhi',
      bio: 'Senior Interventional Cardiologist with 14+ years of clinical excellence in managing chronic hypertension and acute cardiac care.',
      verificationStatus: 'VERIFIED',
    },
  });

  const patientProfile = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      dateOfBirth: new Date('1992-06-15'),
      gender: 'Male',
      bloodGroup: 'O+',
      heightCm: 178.5,
      weightKg: 74.2,
    },
  });

  // Create Patient Address
  await prisma.address.create({
    data: {
      patientId: patientProfile.id,
      addressLine1: 'Flat 402, Apollo Towers',
      addressLine2: 'MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560038',
      latitude: 12.9784,
      longitude: 77.6408,
      isDefault: true,
    },
  });

  // 3. Create Categories
  const catCardio = await prisma.category.upsert({
    where: { slug: 'cardiology-hypertension' },
    update: {},
    create: {
      name: 'Cardiology & Hypertension',
      slug: 'cardiology-hypertension',
      description: 'Prescription blood pressure and cardiac support medications.',
    },
  });

  const catDiabetes = await prisma.category.upsert({
    where: { slug: 'diabetes-endocrinology' },
    update: {},
    create: {
      name: 'Diabetes Care',
      slug: 'diabetes-endocrinology',
      description: 'Insulin and oral hypoglycemic agents.',
    },
  });

  const catOtc = await prisma.category.upsert({
    where: { slug: 'otc-pain-fever' },
    update: {},
    create: {
      name: 'Pain & Fever (OTC)',
      slug: 'otc-pain-fever',
      description: 'Over-the-counter analgesics and antipyretics.',
    },
  });

  // 4. Create Manufacturers
  const mfgSun = await prisma.manufacturer.upsert({
    where: { name: 'Sun Pharmaceutical Industries Ltd' },
    update: {},
    create: {
      name: 'Sun Pharmaceutical Industries Ltd',
      licenseNumber: 'MFG-SUN-2020-001',
      country: 'India',
    },
  });

  const mfgCipla = await prisma.manufacturer.upsert({
    where: { name: 'Cipla Limited' },
    update: {},
    create: {
      name: 'Cipla Limited',
      licenseNumber: 'MFG-CIPLA-2019-082',
      country: 'India',
    },
  });

  // 5. Create Pharmacy Store
  const pharmacyStore = await prisma.pharmacyStore.upsert({
    where: { storeCode: 'STORE-BLR-001' },
    update: {},
    create: {
      name: 'Pharma Care Hub - Bangalore Indiranagar',
      storeCode: 'STORE-BLR-001',
      licenseNumber: 'DL-KA-2026-99120',
      contactPhone: '+918041234567',
      isActive: true,
    },
  });

  // 6. Create Medicines & Batches
  const medTelmisartan = await prisma.medicine.upsert({
    where: { sku: 'SKU-TELMI-40-SUN' },
    update: {},
    create: {
      sku: 'SKU-TELMI-40-SUN',
      genericName: 'Telmisartan',
      brandName: 'Telma 40 Tablet',
      categoryId: catCardio.id,
      manufacturerId: mfgSun.id,
      dosageForm: 'Tablet',
      strength: '40mg',
      scheduleType: 'Schedule H',
      requiresPrescription: true,
      mrp: 245.00,
      barcode: '8901111222333',
      imageUrls: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    },
  });

  const medTelmisartanGeneric = await prisma.medicine.upsert({
    where: { sku: 'SKU-TELMI-40-CIPLA' },
    update: {},
    create: {
      sku: 'SKU-TELMI-40-CIPLA',
      genericName: 'Telmisartan',
      brandName: 'Ciplar-T 40mg (Generic Substitute)',
      categoryId: catCardio.id,
      manufacturerId: mfgCipla.id,
      dosageForm: 'Tablet',
      strength: '40mg',
      scheduleType: 'Schedule H',
      requiresPrescription: true,
      mrp: 110.00,
      barcode: '8901111222444',
      imageUrls: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    },
  });

  await prisma.medicineAlternative.upsert({
    where: {
      primaryMedicineId_substituteMedicineId: {
        primaryMedicineId: medTelmisartan.id,
        substituteMedicineId: medTelmisartanGeneric.id,
      },
    },
    update: {},
    create: {
      primaryMedicineId: medTelmisartan.id,
      substituteMedicineId: medTelmisartanGeneric.id,
      bioEquivalenceScore: 0.99,
    },
  });

  const medParacetamol = await prisma.medicine.upsert({
    where: { sku: 'SKU-PARA-650-CIPLA' },
    update: {},
    create: {
      sku: 'SKU-PARA-650-CIPLA',
      genericName: 'Paracetamol',
      brandName: 'Dolo 650 Tablet',
      categoryId: catOtc.id,
      manufacturerId: mfgCipla.id,
      dosageForm: 'Tablet',
      strength: '650mg',
      scheduleType: 'OTC',
      requiresPrescription: false,
      mrp: 32.50,
      barcode: '8901111222555',
      imageUrls: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    },
  });

  // Create Inventory & Batches
  const invTelma = await prisma.inventory.upsert({
    where: {
      storeId_medicineId: {
        storeId: pharmacyStore.id,
        medicineId: medTelmisartan.id,
      },
    },
    update: { totalQuantity: 150 },
    create: {
      storeId: pharmacyStore.id,
      medicineId: medTelmisartan.id,
      totalQuantity: 150,
      reservedQuantity: 0,
      reorderPoint: 20,
      lastRestockedAt: new Date(),
    },
  });

  await prisma.medicineBatch.upsert({
    where: {
      inventoryId_batchNumber: {
        inventoryId: invTelma.id,
        batchNumber: 'BATCH-SUN-202607-A',
      },
    },
    update: {},
    create: {
      inventoryId: invTelma.id,
      batchNumber: 'BATCH-SUN-202607-A',
      manufacturingDate: new Date('2026-01-10'),
      expiryDate: new Date('2028-01-10'),
      purchasePrice: 180.00,
      sellingPrice: 245.00,
      quantity: 150,
    },
  });

  const invPara = await prisma.inventory.upsert({
    where: {
      storeId_medicineId: {
        storeId: pharmacyStore.id,
        medicineId: medParacetamol.id,
      },
    },
    update: { totalQuantity: 500 },
    create: {
      storeId: pharmacyStore.id,
      medicineId: medParacetamol.id,
      totalQuantity: 500,
      reservedQuantity: 0,
      reorderPoint: 50,
      lastRestockedAt: new Date(),
    },
  });

  await prisma.medicineBatch.upsert({
    where: {
      inventoryId_batchNumber: {
        inventoryId: invPara.id,
        batchNumber: 'BATCH-CIP-202605-B',
      },
    },
    update: {},
    create: {
      inventoryId: invPara.id,
      batchNumber: 'BATCH-CIP-202605-B',
      manufacturingDate: new Date('2026-03-15'),
      expiryDate: new Date('2029-03-15'),
      purchasePrice: 22.00,
      sellingPrice: 32.50,
      quantity: 500,
    },
  });

  // 7. Create Doctor Availability & Time Slots
  await prisma.doctorAvailability.createMany({
    data: [
      { doctorId: doctorProfile.id, dayOfWeek: 1, startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30 },
      { doctorId: doctorProfile.id, dayOfWeek: 2, startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30 },
      { doctorId: doctorProfile.id, dayOfWeek: 3, startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30 },
      { doctorId: doctorProfile.id, dayOfWeek: 4, startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30 },
      { doctorId: doctorProfile.id, dayOfWeek: 5, startTime: '10:00', endTime: '14:00', slotDurationMinutes: 30 },
    ],
    skipDuplicates: true,
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const slotDateStr = tomorrow.toISOString().split('T')[0];

  const slotStart1 = new Date(`${slotDateStr}T10:00:00.000Z`);
  const slotEnd1 = new Date(`${slotDateStr}T10:30:00.000Z`);
  const slotStart2 = new Date(`${slotDateStr}T10:30:00.000Z`);
  const slotEnd2 = new Date(`${slotDateStr}T11:00:00.000Z`);

  await prisma.timeSlot.upsert({
    where: { doctorId_startTime: { doctorId: doctorProfile.id, startTime: slotStart1 } },
    update: {},
    create: {
      doctorId: doctorProfile.id,
      slotDate: new Date(slotDateStr),
      startTime: slotStart1,
      endTime: slotEnd1,
      isBooked: false,
    },
  });

  await prisma.timeSlot.upsert({
    where: { doctorId_startTime: { doctorId: doctorProfile.id, startTime: slotStart2 } },
    update: {},
    create: {
      doctorId: doctorProfile.id,
      slotDate: new Date(slotDateStr),
      startTime: slotStart2,
      endTime: slotEnd2,
      isBooked: false,
    },
  });

  // 8. Create Welcome Coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      discountType: 'PERCENTAGE',
      value: 20.00,
      minOrderValue: 200.00,
      maxDiscountAmount: 150.00,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2027-12-31'),
      usageLimit: 5000,
    },
  });

  console.log('✅ Enterprise Database Seeder Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
