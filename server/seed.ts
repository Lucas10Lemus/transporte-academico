import { db } from "./db";
import { users, routes, enrollments, payments } from "@shared/schema";
import { hashPassword } from "./auth";

async function seed() {
  console.log("Seeding database...");

  try {
    // Create admin user
    const adminPasswordHash = await hashPassword("admin123");
    const [admin] = await db.insert(users).values({
      fullName: "Admin User",
      email: "admin@transport.com",
      passwordHash: adminPasswordHash,
      phoneNumber: "+55 11 99999-0001",
      role: "ADMIN",
      isActive: true,
    }).returning();
    console.log("✓ Created admin user");

    // Create drivers
    const driver1PasswordHash = await hashPassword("driver123");
    const [driver1] = await db.insert(users).values({
      fullName: "João Silva",
      email: "joao@transport.com",
      passwordHash: driver1PasswordHash,
      phoneNumber: "+55 11 98765-4321",
      role: "DRIVER",
      isActive: true,
    }).returning();

    const driver2PasswordHash = await hashPassword("driver123");
    const [driver2] = await db.insert(users).values({
      fullName: "Maria Santos",
      email: "maria@transport.com",
      passwordHash: driver2PasswordHash,
      phoneNumber: "+55 11 91234-5678",
      role: "DRIVER",
      isActive: true,
    }).returning();
    console.log("✓ Created drivers");

    // Create students
    const student1PasswordHash = await hashPassword("student123");
    const [student1] = await db.insert(users).values({
      fullName: "Ana Costa",
      email: "ana@student.com",
      passwordHash: student1PasswordHash,
      phoneNumber: "+55 11 98123-4567",
      role: "STUDENT",
      isActive: true,
    }).returning();

    const student2PasswordHash = await hashPassword("student123");
    const [student2] = await db.insert(users).values({
      fullName: "Bruno Lima",
      email: "bruno@student.com",
      passwordHash: student2PasswordHash,
      phoneNumber: "+55 11 97234-5678",
      role: "STUDENT",
      isActive: true,
    }).returning();

    const student3PasswordHash = await hashPassword("student123");
    const [student3] = await db.insert(users).values({
      fullName: "Carla Souza",
      email: "carla@student.com",
      passwordHash: student3PasswordHash,
      phoneNumber: "+55 11 96345-6789",
      role: "STUDENT",
      isActive: true,
    }).returning();
    console.log("✓ Created students");

    // Create routes
    const [route1] = await db.insert(routes).values({
      name: "North Campus Route",
      driverId: driver1.id,
      maxCapacity: 30,
      startTime: "07:00",
      isActive: true,
    }).returning();

    const [route2] = await db.insert(routes).values({
      name: "South Campus Route",
      driverId: driver2.id,
      maxCapacity: 25,
      startTime: "07:30",
      isActive: true,
    }).returning();
    console.log("✓ Created routes");

    // Create enrollments
    const [enrollment1] = await db.insert(enrollments).values({
      studentId: student1.id,
      routeId: route1.id,
      monthlyFee: "250.00",
      dueDay: 5,
      isActive: true,
    }).returning();

    const [enrollment2] = await db.insert(enrollments).values({
      studentId: student2.id,
      routeId: route2.id,
      monthlyFee: "250.00",
      dueDay: 10,
      isActive: true,
    }).returning();

    const [enrollment3] = await db.insert(enrollments).values({
      studentId: student3.id,
      routeId: route1.id,
      monthlyFee: "250.00",
      dueDay: 15,
      isActive: true,
    }).returning();
    console.log("✓ Created enrollments");

    // Create payments
    await db.insert(payments).values([
      {
        enrollmentId: enrollment1.id,
        billingMonth: new Date("2025-11-01"),
        amountDue: "250.00",
        status: "PAID",
        paidAt: new Date("2025-11-05"),
        processorById: admin.id,
      },
      {
        enrollmentId: enrollment2.id,
        billingMonth: new Date("2025-11-01"),
        amountDue: "250.00",
        status: "PENDING",
      },
      {
        enrollmentId: enrollment3.id,
        billingMonth: new Date("2025-10-01"),
        amountDue: "250.00",
        status: "OVERDUE",
      },
    ]);
    console.log("✓ Created payments");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nTest credentials:");
    console.log("Admin: admin@transport.com / admin123");
    console.log("Driver: joao@transport.com / driver123");
    console.log("Student: ana@student.com / student123");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
