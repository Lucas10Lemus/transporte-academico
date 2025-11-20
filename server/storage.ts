import { users, routes, enrollments, payments, auditLogs, dailyPresence } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm"; 
import type { User, InsertUser, Route, InsertRoute, Enrollment, InsertEnrollment, Payment, InsertPayment, AuditLog, InsertAuditLog, InsertPresence, DailyPresence } from "@shared/schema";

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

  // --- MATRÍCULAS ---
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const data = {
      ...enrollment,
      monthlyFee: enrollment.monthlyFee.toString(), // Converte para string para o banco
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

  // --- PRESENÇA DIÁRIA (A Lógica que faltava!) ---
  async getDailyPresence(studentId: string, date: Date): Promise<DailyPresence | undefined> {
    // Pega a string da data YYYY-MM-DD para comparação
    const dateStr = date.toISOString().split('T')[0];
    
    // Nota: Drizzle com driver pg pode retornar Date objects ou strings dependendo da config.
    // Aqui assumimos que a comparação direta funciona ou precisamos ajustar no banco.
    // Para simplificar e evitar erros de fuso horário, vamos buscar todos do aluno e filtrar no código se necessário,
    // mas o ideal é usar sql raw ou funções de data. Vamos tentar o match exato primeiro.
    
    const allPresences = await db.select().from(dailyPresence).where(eq(dailyPresence.studentId, studentId));
    return allPresences.find(p => p.date === dateStr);
  }

  async markPresence(presence: InsertPresence): Promise<DailyPresence> {
    const dateObj = new Date(presence.date);
    const existing = await this.getDailyPresence(presence.studentId, dateObj);
    
    if (existing) {
      const [updated] = await db.update(dailyPresence)
        .set({
          statusIda: presence.statusIda,
          statusVolta: presence.statusVolta,
          observation: presence.observation,
          updatedAt: new Date()
        })
        .where(eq(dailyPresence.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(dailyPresence).values(presence).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();