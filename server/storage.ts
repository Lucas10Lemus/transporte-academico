import { users, routes, enrollments, payments, auditLogs } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm"; // Adicionado 'desc' que faltava
import type { User, InsertUser, Route, InsertRoute, Enrollment, InsertEnrollment, Payment, InsertPayment, AuditLog, InsertAuditLog } from "@shared/schema";

export class DatabaseStorage {
  
  // --- USUÁRIOS ---
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
    return !!deleted;
  }

  async listUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // --- ROTAS ---
  async listRoutes(): Promise<Route[]> {
    return await db.select().from(routes).orderBy(routes.name);
  }

  async listActiveRoutes(): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }

  async getRoute(id: string): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route;
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const [newRoute] = await db.insert(routes).values(route).returning();
    return newRoute;
  }

  async updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route | undefined> {
    const [updated] = await db.update(routes).set(route).where(eq(routes.id, id)).returning();
    return updated;
  }

  async deleteRoute(id: string): Promise<boolean> {
    const [deleted] = await db.delete(routes).where(eq(routes.id, id)).returning();
    return !!deleted;
  }

  // --- MATRÍCULAS (ENROLLMENTS) ---
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    // Conversão de segurança: Garante que monthlyFee seja string
    const data = {
      ...enrollment,
      monthlyFee: enrollment.monthlyFee.toString(),
    };
    const [newEnrollment] = await db.insert(enrollments).values(data).returning();
    return newEnrollment;
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

  async updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    // Conversão de segurança para atualização parcial
    const data: any = { ...enrollment };
    if (enrollment.monthlyFee !== undefined) {
      data.monthlyFee = enrollment.monthlyFee.toString();
    }
    
    const [updated] = await db.update(enrollments).set(data).where(eq(enrollments.id, id)).returning();
    return updated;
  }

  async deleteEnrollment(id: string): Promise<boolean> {
    const [deleted] = await db.delete(enrollments).where(eq(enrollments.id, id)).returning();
    return !!deleted;
  }
  
  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return enrollment;
  }

  // --- PAGAMENTOS ---
  async createPayment(payment: InsertPayment): Promise<Payment> {
    // Conversão de segurança: Garante que amountDue seja string
    const data = {
      ...payment,
      amountDue: payment.amountDue.toString(),
    };
    const [newPayment] = await db.insert(payments).values(data).returning();
    return newPayment;
  }

  async listPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.billingMonth));
  }

  async listPaymentsByEnrollment(enrollmentId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.enrollmentId, enrollmentId));
  }

  async updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
     // Conversão de segurança
    const data: any = { ...payment };
    if (payment.amountDue !== undefined) {
      data.amountDue = payment.amountDue.toString();
    }
    const [updated] = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return updated;
  }

  async deletePayment(id: string): Promise<boolean> {
    const [deleted] = await db.delete(payments).where(eq(payments.id, id)).returning();
    return !!deleted;
  }
  
  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  // --- LOGS DE AUDITORIA ---
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async listAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);
  }
}

export const storage = new DatabaseStorage();