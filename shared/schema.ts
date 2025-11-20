import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, numeric, pgEnum, time, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "COORDINATOR", "DRIVER", "STUDENT"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PAID", "PENDING", "OVERDUE"]);

// Tabelas
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phoneNumber: text("phone_number"),
  role: userRoleEnum("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  driverId: varchar("driver_id").references(() => users.id),
  maxCapacity: integer("max_capacity").notNull(),
  startTime: time("start_time").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  routeId: varchar("route_id").notNull().references(() => routes.id),
  monthlyFee: numeric("monthly_fee", { precision: 10, scale: 2 }).notNull(),
  dueDay: integer("due_day").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").notNull().references(() => enrollments.id),
  billingMonth: timestamp("billing_month").notNull(),
  amountDue: numeric("amount_due", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("PENDING"),
  processorById: varchar("processor_by_id").references(() => users.id),
  paidAt: timestamp("paid_at"),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  targetTable: varchar("target_table", { length: 50 }).notNull(),
  targetId: varchar("target_id"),
  changes: text("changes"),
  timestamp: timestamp("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// --- NOVA TABELA: LISTA DE PRESENÇA ---
export const dailyPresence = pgTable("daily_presence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  date: date("date").notNull(), // Data da viagem (YYYY-MM-DD)
  statusIda: boolean("status_ida").default(false), // TRUE = VOU
  statusVolta: boolean("status_volta").default(false), // TRUE = VOU
  observation: text("observation"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Schemas de Validação (Zod)
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  phoneNumber: z.string().optional(),
}).omit({
  id: true,
});

export const updateUserSchema = insertUserSchema.omit({
  passwordHash: true,
}).extend({
  password: z.string().min(6).optional(),
}).partial();

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
});

export const updateRouteSchema = insertRouteSchema.partial();

export const insertEnrollmentSchema = createInsertSchema(enrollments, {
  monthlyFee: z.string().or(z.number()),
  dueDay: z.number().min(1).max(31),
}).omit({
  id: true,
});

export const updateEnrollmentSchema = insertEnrollmentSchema.partial();

export const insertPaymentSchema = createInsertSchema(payments, {
  amountDue: z.string().or(z.number()),
}).omit({
  id: true,
});

export const updatePaymentSchema = insertPaymentSchema.partial();

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

// --- NOVO SCHEMA DE PRESENÇA ---
export const insertPresenceSchema = createInsertSchema(dailyPresence).omit({
  id: true,
  updatedAt: true
});


// Tipos Exportados
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type UpdateRoute = z.infer<typeof updateRouteSchema>;
export type Route = typeof routes.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type UpdateEnrollment = z.infer<typeof updateEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type UpdatePayment = z.infer<typeof updatePaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// --- NOVOS TIPOS DE PRESENÇA ---
export type InsertPresence = z.infer<typeof insertPresenceSchema>;
export type DailyPresence = typeof dailyPresence.$inferSelect;

// Tabela de Sessão (para o Drizzle saber que ela existe)
export const session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull(),
});