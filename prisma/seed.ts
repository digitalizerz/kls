import { PrismaClient, UserRole, CleaningFrequency, ServiceType, ServiceStatus, DocumentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysFromNow(days: number) {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.cleaningReport.deleteMany();
  await prisma.complianceManifest.deleteMany();
  await prisma.serviceRecord.deleteMany();
  await prisma.serviceRequestGreaseTrap.deleteMany();
  await prisma.serviceJobGreaseTrap.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.serviceJob.deleteMany();
  await prisma.greaseTrap.deleteMany();
  await prisma.location.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.contactInquiry.deleteMany();

  const harbor = await prisma.customer.create({
    data: {
      companyName: "Harbor & Oak Restaurant Group",
      contactName: "Maria Alvarez",
      email: "oscar.d@example.net",
      phone: "(512) 555-0148",
      billingAddressLine1: "410 Commerce Street",
      billingCity: "Austin",
      billingState: "TX",
      billingZipCode: "78701",
      status: "ACTIVE",
      onboardingCompletedAt: daysFromNow(-120),
    },
  });

  const cedar = await prisma.customer.create({
    data: {
      companyName: "Cedar Ridge Hotel",
      contactName: "James Whitaker",
      email: "yosef.c@example.com",
      phone: "(512) 555-0192",
      billingAddressLine1: "88 Hillcrest Drive",
      billingCity: "Austin",
      billingState: "TX",
      billingZipCode: "78704",
      status: "ACTIVE",
      onboardingCompletedAt: daysFromNow(-80),
    },
  });

  const midtown = await prisma.customer.create({
    data: {
      companyName: "Midtown Market Kitchen",
      contactName: "Priya Shah",
      email: "xavier.y@example.org",
      phone: "(512) 555-0166",
      billingAddressLine1: "1200 Guadalupe Street",
      billingCity: "Austin",
      billingState: "TX",
      billingZipCode: "78701",
      status: "ACTIVE",
      onboardingCompletedAt: daysFromNow(-40),
    },
  });

  const [superAdmin, adminUser, techUser, maria, james, priya] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Elena Brooks",
        email: "ivan.p@example.net",
        passwordHash,
        phone: "(512) 555-0100",
        role: UserRole.SUPER_ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "David Chen",
        email: "zoe.m@example.net",
        passwordHash,
        phone: "(512) 555-0101",
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Luis Ortega",
        email: "hannah.h@example.com",
        passwordHash,
        phone: "(512) 555-0108",
        role: UserRole.TECHNICIAN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Maria Alvarez",
        email: "oscar.d@example.net",
        passwordHash,
        phone: "(512) 555-0148",
        role: UserRole.CUSTOMER,
        customerId: harbor.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "James Whitaker",
        email: "yosef.c@example.com",
        passwordHash,
        phone: "(512) 555-0192",
        role: UserRole.CUSTOMER,
        customerId: cedar.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Shah",
        email: "xavier.y@example.org",
        passwordHash,
        phone: "(512) 555-0166",
        role: UserRole.CUSTOMER,
        customerId: midtown.id,
      },
    }),
  ]);

  const technician = await prisma.technician.create({
    data: {
      userId: techUser.id,
      employeeId: "TECH-104",
      status: "ACTIVE",
    },
  });

  const downtown = await prisma.location.create({
    data: {
      customerId: harbor.id,
      locationName: "Harbor & Oak Downtown",
      addressLine1: "410 Commerce Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      contactName: "Maria Alvarez",
      contactPhone: "(512) 555-0148",
      contactEmail: "oscar.d@example.net",
      waterPurveyor: "Austin Water",
    },
  });

  const midtownLoc = await prisma.location.create({
    data: {
      customerId: harbor.id,
      locationName: "Harbor & Oak Midtown",
      addressLine1: "1904 Guadalupe Street",
      city: "Austin",
      state: "TX",
      zipCode: "78705",
      contactName: "Andre Cole",
      contactPhone: "(512) 555-0149",
      contactEmail: "ursula.b@example.com",
      waterPurveyor: "Austin Water",
    },
  });

  const airport = await prisma.location.create({
    data: {
      customerId: harbor.id,
      locationName: "Harbor & Oak Airport",
      addressLine1: "3600 Presidential Boulevard",
      addressLine2: "Terminal food court, Suite 214",
      city: "Austin",
      state: "TX",
      zipCode: "78719",
      contactName: "Kim Nguyen",
      contactPhone: "(512) 555-0150",
      contactEmail: "tina.r@example.net",
      waterPurveyor: "Austin Water",
    },
  });

  const hotel = await prisma.location.create({
    data: {
      customerId: cedar.id,
      locationName: "Cedar Ridge Hotel — Main Kitchen",
      addressLine1: "88 Hillcrest Drive",
      city: "Austin",
      state: "TX",
      zipCode: "78704",
      contactName: "James Whitaker",
      contactPhone: "(512) 555-0192",
      contactEmail: "yosef.c@example.com",
      waterPurveyor: "Austin Water",
    },
  });

  const marketMain = await prisma.location.create({
    data: {
      customerId: midtown.id,
      locationName: "Midtown Market — Flagship",
      addressLine1: "1200 Guadalupe Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      contactName: "Priya Shah",
      contactPhone: "(512) 555-0166",
      contactEmail: "xavier.y@example.org",
      waterPurveyor: "Austin Water",
    },
  });

  const marketEast = await prisma.location.create({
    data: {
      customerId: midtown.id,
      locationName: "Midtown Market — East",
      addressLine1: "1401 E 7th Street",
      city: "Austin",
      state: "TX",
      zipCode: "78702",
      contactName: "Chris Patel",
      contactPhone: "(512) 555-0167",
      contactEmail: "grace.l@example.com",
      waterPurveyor: "Austin Water",
    },
  });

  const traps = await Promise.all([
    prisma.greaseTrap.create({
      data: {
        locationId: downtown.id,
        nameOrIdentifier: "Kitchen interceptor — 1000 gal",
        capacityGallons: 1000,
        onsiteLocationDescription: "Alley behind dish pit, below grade",
        cleaningFrequency: CleaningFrequency.MONTHLY,
        lastCleanedAt: daysFromNow(-28),
        nextRecommendedServiceAt: daysFromNow(2),
      },
    }),
    prisma.greaseTrap.create({
      data: {
        locationId: downtown.id,
        nameOrIdentifier: "Bar under-sink trap",
        capacityGallons: 50,
        onsiteLocationDescription: "Under main bar sink",
        cleaningFrequency: CleaningFrequency.QUARTERLY,
        lastCleanedAt: daysFromNow(-60),
        nextRecommendedServiceAt: daysFromNow(30),
      },
    }),
    prisma.greaseTrap.create({
      data: {
        locationId: midtownLoc.id,
        nameOrIdentifier: "Main kitchen interceptor",
        capacityGallons: 750,
        onsiteLocationDescription: "Parking lot vault, west wall",
        cleaningFrequency: CleaningFrequency.MONTHLY,
        lastCleanedAt: daysFromNow(-40),
        nextRecommendedServiceAt: daysFromNow(-10),
      },
    }),
    prisma.greaseTrap.create({
      data: {
        locationId: airport.id,
        nameOrIdentifier: "Terminal kitchen interceptor",
        capacityGallons: 500,
        onsiteLocationDescription: "Service corridor 2B",
        cleaningFrequency: CleaningFrequency.MONTHLY,
        lastCleanedAt: daysFromNow(-12),
        nextRecommendedServiceAt: daysFromNow(18),
      },
    }),
    prisma.greaseTrap.create({
      data: {
        locationId: hotel.id,
        nameOrIdentifier: "Banquet kitchen interceptor",
        capacityGallons: 1500,
        onsiteLocationDescription: "Loading dock vault",
        cleaningFrequency: CleaningFrequency.MONTHLY,
        lastCleanedAt: daysFromNow(-20),
        nextRecommendedServiceAt: daysFromNow(10),
      },
    }),
    prisma.greaseTrap.create({
      data: {
        locationId: hotel.id,
        nameOrIdentifier: "Cafe under-sink trap",
        capacityGallons: 35,
        onsiteLocationDescription: "Lobby cafe dish area",
        cleaningFrequency: CleaningFrequency.QUARTERLY,
        lastCleanedAt: daysFromNow(-50),
        nextRecommendedServiceAt: daysFromNow(40),
      },
    }),
    prisma.greaseTrap.create({
      data: {
        locationId: marketMain.id,
        nameOrIdentifier: "Hot bar interceptor",
        capacityGallons: 300,
        onsiteLocationDescription: "Behind hot bar, exterior cleanout",
        cleaningFrequency: CleaningFrequency.MONTHLY,
        lastCleanedAt: daysFromNow(-5),
        nextRecommendedServiceAt: daysFromNow(25),
      },
    }),
    prisma.greaseTrap.create({
      data: {
        locationId: marketEast.id,
        nameOrIdentifier: "Prep kitchen interceptor",
        capacityGallons: 250,
        onsiteLocationDescription: "Rear alley, north corner",
        cleaningFrequency: CleaningFrequency.CUSTOM,
        customFrequencyDays: 45,
        lastCleanedAt: daysFromNow(-44),
        nextRecommendedServiceAt: daysFromNow(1),
      },
    }),
  ]);

  const [downtownMain, , midtownMain, airportTrap, hotelBanquet] = traps;

  const completedJob = await prisma.serviceJob.create({
    data: {
      customerId: harbor.id,
      locationId: downtown.id,
      technicianId: technician.id,
      serviceType: ServiceType.ROUTINE_CLEANING,
      status: ServiceStatus.COMPLETED,
      scheduledAt: daysFromNow(-28),
      startedAt: daysFromNow(-28),
      completedAt: daysFromNow(-28),
      customerNotes: "Please arrive before lunch prep.",
      traps: { create: [{ greaseTrapId: downtownMain.id }] },
    },
  });

  const record = await prisma.serviceRecord.create({
    data: {
      jobId: completedJob.id,
      completedByUserId: techUser.id,
      completedAt: daysFromNow(-28),
      gallonsRemoved: 180,
      wasteHauler: "KLS Environmental LLC",
      wasteDestination: "Licensed FOG receiving facility",
      technicianNotes: "Trap in good condition. Lid gasket serviceable.",
      customerSignatureName: "Maria Alvarez",
      customerSignedAt: daysFromNow(-28),
    },
  });

  await prisma.cleaningReport.create({
    data: {
      serviceRecordId: record.id,
      status: "ISSUED",
      generatedAt: daysFromNow(-28),
      notes: "Placeholder report record. Official PDF template pending.",
    },
  });

  await prisma.complianceManifest.create({
    data: {
      serviceRecordId: record.id,
      status: "READY_FOR_GENERATION",
      jurisdiction: "Pending official template",
      notes: "Structured service data is stored and ready to map into the official manifest.",
    },
  });

  const todayJob = await prisma.serviceJob.create({
    data: {
      customerId: cedar.id,
      locationId: hotel.id,
      technicianId: technician.id,
      serviceType: ServiceType.ROUTINE_CLEANING,
      status: ServiceStatus.SCHEDULED,
      scheduledAt: daysFromNow(0),
      traps: { create: [{ greaseTrapId: hotelBanquet.id }] },
    },
  });

  await prisma.serviceJob.create({
    data: {
      customerId: harbor.id,
      locationId: airport.id,
      technicianId: technician.id,
      serviceType: ServiceType.ROUTINE_CLEANING,
      status: ServiceStatus.SCHEDULED,
      scheduledAt: daysFromNow(3),
      traps: { create: [{ greaseTrapId: airportTrap.id }] },
    },
  });

  const pendingRequest = await prisma.serviceRequest.create({
    data: {
      customerId: harbor.id,
      locationId: midtownLoc.id,
      serviceType: ServiceType.EMERGENCY_CLEANING,
      status: ServiceStatus.REQUESTED,
      preferredDate: daysFromNow(2),
      alternativeDate: daysFromNow(3),
      notes: "Slow drain at dish pit. Please treat as priority if possible.",
      contactName: "Andre Cole",
      contactPhone: "(512) 555-0149",
      contactEmail: "ursula.b@example.com",
      traps: { create: [{ greaseTrapId: midtownMain.id }] },
    },
  });

  await prisma.serviceRequest.create({
    data: {
      customerId: midtown.id,
      locationId: marketEast.id,
      serviceType: ServiceType.ROUTINE_CLEANING,
      status: ServiceStatus.REQUESTED,
      preferredDate: daysFromNow(7),
      notes: "Please schedule around morning receiving, 7–10 a.m.",
      contactName: "Chris Patel",
      contactPhone: "(512) 555-0167",
      contactEmail: "grace.l@example.com",
      traps: { create: [{ greaseTrapId: traps[7].id }] },
    },
  });

  await prisma.document.createMany({
    data: [
      {
        customerId: harbor.id,
        locationId: downtown.id,
        serviceJobId: completedJob.id,
        serviceRecordId: record.id,
        type: DocumentType.CLEANING_REPORT,
        title: "Cleaning report — Harbor & Oak Downtown",
        fileName: "harbor-oak-downtown-cleaning-2026-08-04.pdf",
        mimeType: "application/pdf",
        sizeBytes: 184320,
        storageKey: "seed/harbor-oak-downtown-cleaning-2026-08-04.pdf",
      },
      {
        customerId: harbor.id,
        locationId: downtown.id,
        greaseTrapId: downtownMain.id,
        type: DocumentType.PHOTO,
        title: "Interceptor lid after service",
        fileName: "downtown-interceptor-after.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 240100,
        storageKey: "seed/downtown-interceptor-after.jpg",
      },
      {
        customerId: harbor.id,
        locationId: downtown.id,
        type: DocumentType.PREVIOUS_SERVICE_REPORT,
        title: "Prior hauler report (onboarding upload)",
        fileName: "prior-hauler-report.pdf",
        mimeType: "application/pdf",
        sizeBytes: 99000,
        storageKey: "seed/prior-hauler-report.pdf",
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: maria.id,
        customerId: harbor.id,
        type: "OVERDUE_SERVICE",
        channel: "IN_APP",
        status: "PENDING",
        title: "Harbor & Oak Midtown is past due",
        body: "The main kitchen interceptor is past its recommended cleaning date.",
        relatedEntityType: "GreaseTrap",
        relatedEntityId: midtownMain.id,
        scheduledFor: daysFromNow(-10),
      },
      {
        userId: maria.id,
        customerId: harbor.id,
        type: "UPCOMING_SERVICE",
        channel: "EMAIL",
        status: "PENDING",
        title: "Downtown interceptor due soon",
        body: "Recommended service for the 1000-gallon interceptor is in 2 days.",
        relatedEntityType: "GreaseTrap",
        relatedEntityId: downtownMain.id,
        scheduledFor: daysFromNow(0),
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: techUser.id,
        action: "SERVICE_RECORD_COMPLETED",
        entityType: "ServiceRecord",
        entityId: record.id,
        metadata: { jobId: completedJob.id },
      },
      {
        actorId: adminUser.id,
        action: "SERVICE_JOB_SCHEDULED",
        entityType: "ServiceJob",
        entityId: todayJob.id,
        metadata: { locationId: hotel.id },
      },
      {
        actorId: maria.id,
        action: "SERVICE_REQUEST_SUBMITTED",
        entityType: "ServiceRequest",
        entityId: pendingRequest.id,
      },
    ],
  });

  console.log("Seed complete.");
  console.log("  Super admin: ivan.p@example.net / Password123!");
  console.log("  Admin:       zoe.m@example.net / Password123!");
  console.log("  Technician:  hannah.h@example.com / Password123!");
  console.log("  Customer:    oscar.d@example.net / Password123!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
