import { db } from "./db";
import { 
  type User, 
  type InsertUser,
  type Route,
  type InsertRoute,
  type Enrollment,
  type InsertEnrollment,
  type Payment,
  type InsertPayment,
  type AuditLog,
  type InsertAuditLog,
  users,
  routes,
  enrollments,
  payments,
  auditLogs,
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  listUsers(): Promise<User[]>;
  
  // Routes
  getRoute(id: string): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route | undefined>;
  deleteRoute(id: string): Promise<boolean>;
  listRoutes(): Promise<Route[]>;
  listActiveRoutes(): Promise<Route[]>;
  
  // Enrollments
  getEnrollment(id: string): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: string): Promise<boolean>;
  listEnrollments(): Promise<Enrollment[]>;
  listEnrollmentsByStudent(studentId: string): Promise<Enrollment[]>;
  listEnrollmentsByRoute(routeId: string): Promise<Enrollment[]>;
  
  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: string): Promise<boolean>;
  listPayments(): Promise<Payment[]>;
  listPaymentsByEnrollment(enrollmentId: string): Promise<Payment[]>;
  
  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  listAuditLogs(limit?: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async listUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Routes
  async getRoute(id: string): Promise<Route | undefined> {
    const result = await db.select().from(routes).where(eq(routes.id, id));
    return result[0];
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const result = await db.insert(routes).values(route).returning();
    return result[0];
  }

  async updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route | undefined> {
    const result = await db.update(routes).set(route).where(eq(routes.id, id)).returning();
    return result[0];
  }

  async listRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }

  async listActiveRoutes(): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }

  async deleteRoute(id: string): Promise<boolean> {
    const result = await db.delete(routes).where(eq(routes.id, id)).returning();
    return result.length > 0;
  }

  // Enrollments
  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const result = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return result[0];
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const data = {
      ...enrollment,
      monthlyFee: typeof enrollment.monthlyFee === 'number' ? enrollment.monthlyFee.toString() : enrollment.monthlyFee,
    };
    const result = await db.insert(enrollments).values(data).returning();
    return result[0];
  }

  async updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const data = { ...enrollment };
    if (data.monthlyFee !== undefined) {
      data.monthlyFee = typeof data.monthlyFee === 'number' ? data.monthlyFee.toString() : data.monthlyFee;
    }
    const result = await db.update(enrollments).set(data).where(eq(enrollments.id, id)).returning();
    return result[0];
  }

  async listEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments);
  }

  async listEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
  }

  async listEnrollmentsByRoute(routeId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.routeId, routeId));
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const result = await db.delete(enrollments).where(eq(enrollments.id, id)).returning();
    return result.length > 0;
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const data = {
      ...payment,
      amountDue: typeof payment.amountDue === 'number' ? payment.amountDue.toString() : payment.amountDue,
    };
    const result = await db.insert(payments).values(data).returning();
    return result[0];
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    const data = { ...payment };
    if (data.amountDue !== undefined) {
      data.amountDue = typeof data.amountDue === 'number' ? data.amountDue.toString() : data.amountDue;
    }
    const result = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return result[0];
  }

  async listPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.billingMonth));
  }

  async listPaymentsByEnrollment(enrollmentId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.enrollmentId, enrollmentId));
  }

  async deletePayment(id: string): Promise<boolean> {
    const result = await db.delete(payments).where(eq(payments.id, id)).returning();
    return result.length > 0;
  }

  // Audit Logs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values(log).returning();
    return result[0];
  }

  async listAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
