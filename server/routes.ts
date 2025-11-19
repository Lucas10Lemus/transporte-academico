import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, verifyPassword, requireAuth, requireRole } from "./auth";
import { 
  insertUserSchema, 
  updateUserSchema,
  insertRouteSchema, 
  updateRouteSchema,
  insertEnrollmentSchema, 
  updateEnrollmentSchema,
  insertPaymentSchema,
  updatePaymentSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication Routes
  app.post("/api/auth/register", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const passwordHash = await hashPassword(userData.passwordHash);
      const user = await storage.createUser({
        ...userData,
        passwordHash,
      });

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "CREATE",
        targetTable: "users",
        targetId: user.id,
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      await storage.createAuditLog({
        userId: req.user?.id || "SYSTEM",
        actionType: "FAILED_CREATE",
        targetTable: "users",
        changes: JSON.stringify({ error: error.message }),
      });
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        await storage.createAuditLog({
          userId: "SYSTEM",
          actionType: "FAILED_LOGIN",
          targetTable: "users",
          changes: JSON.stringify({ email }),
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        await storage.createAuditLog({
          userId: user.id,
          actionType: "FAILED_LOGIN",
          targetTable: "users",
          targetId: user.id,
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      await storage.createAuditLog({
        userId: user.id,
        actionType: "LOGIN",
        targetTable: "users",
        targetId: user.id,
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      if (userId) {
        storage.createAuditLog({
          userId,
          actionType: "LOGOUT",
          targetTable: "users",
          targetId: userId,
        });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const { passwordHash: _, ...userWithoutPassword } = req.user!;
    res.json({ user: userWithoutPassword });
  });

  // User Routes
  app.get("/api/users", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const users = await storage.listUsers();
      const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/users/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const allowedUpdates = updateUserSchema.parse(req.body);
      
      const updateData: any = { ...allowedUpdates };
      if (allowedUpdates.password) {
        updateData.passwordHash = await hashPassword(allowedUpdates.password);
        delete updateData.password;
      }

      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "UPDATE",
        targetTable: "users",
        targetId: user.id,
        changes: JSON.stringify(allowedUpdates),
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const enrollments = await storage.listEnrollmentsByStudent(req.params.id);
      if (enrollments.length > 0) {
        return res.status(400).json({ error: "Cannot delete user with active enrollments" });
      }

      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "DELETE",
        targetTable: "users",
        targetId: req.params.id,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route Management Routes
  app.get("/api/routes", requireAuth, async (req, res) => {
    try {
      const routes = await storage.listRoutes();
      res.json({ routes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/routes/active", requireAuth, async (req, res) => {
    try {
      const routes = await storage.listActiveRoutes();
      res.json({ routes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/routes/:id", requireAuth, async (req, res) => {
    try {
      const route = await storage.getRoute(req.params.id);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      res.json({ route });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/routes", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const routeData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(routeData);

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "CREATE",
        targetTable: "routes",
        targetId: route.id,
      });

      res.json({ route });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/routes/:id", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const allowedUpdates = updateRouteSchema.parse(req.body);
      const route = await storage.updateRoute(req.params.id, allowedUpdates);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "UPDATE",
        targetTable: "routes",
        targetId: route.id,
        changes: JSON.stringify(allowedUpdates),
      });

      res.json({ route });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/routes/:id", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const enrollments = await storage.listEnrollmentsByRoute(req.params.id);
      if (enrollments.length > 0) {
        return res.status(400).json({ error: "Cannot delete route with active enrollments" });
      }

      const deleted = await storage.deleteRoute(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Route not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "DELETE",
        targetTable: "routes",
        targetId: req.params.id,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Enrollment Routes
  app.get("/api/enrollments", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const enrollments = await storage.listEnrollments();
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/enrollments/student/:studentId", requireAuth, async (req, res) => {
    try {
      if (req.user!.role === "STUDENT" && req.user!.id !== req.params.studentId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const enrollments = await storage.listEnrollmentsByStudent(req.params.studentId);
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/enrollments/route/:routeId", requireAuth, requireRole("ADMIN", "COORDINATOR", "DRIVER"), async (req, res) => {
    try {
      const enrollments = await storage.listEnrollmentsByRoute(req.params.routeId);
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/enrollments", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "CREATE",
        targetTable: "enrollments",
        targetId: enrollment.id,
      });

      res.json({ enrollment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/enrollments/:id", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const allowedUpdates = updateEnrollmentSchema.parse(req.body);
      const enrollment = await storage.updateEnrollment(req.params.id, allowedUpdates);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "UPDATE",
        targetTable: "enrollments",
        targetId: enrollment.id,
        changes: JSON.stringify(allowedUpdates),
      });

      res.json({ enrollment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/enrollments/:id", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const payments = await storage.listPaymentsByEnrollment(req.params.id);
      if (payments.some(p => p.status === "PENDING" || p.status === "OVERDUE")) {
        return res.status(400).json({ error: "Cannot delete enrollment with pending payments" });
      }

      const deleted = await storage.deleteEnrollment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "DELETE",
        targetTable: "enrollments",
        targetId: req.params.id,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment Routes
  app.get("/api/payments", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const payments = await storage.listPayments();
      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/payments/enrollment/:enrollmentId", requireAuth, async (req, res) => {
    try {
      const payments = await storage.listPaymentsByEnrollment(req.params.enrollmentId);
      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/payments", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "CREATE",
        targetTable: "payments",
        targetId: payment.id,
      });

      res.json({ payment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/payments/:id", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const allowedUpdates = updatePaymentSchema.parse(req.body);
      
      if (allowedUpdates.status === "PAID" && !allowedUpdates.paidAt) {
        allowedUpdates.paidAt = new Date();
        allowedUpdates.processorById = req.user!.id;
      }

      const payment = await storage.updatePayment(req.params.id, allowedUpdates);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "UPDATE",
        targetTable: "payments",
        targetId: payment.id,
        changes: JSON.stringify(allowedUpdates),
      });

      res.json({ payment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/payments/:id", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const deleted = await storage.deletePayment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "DELETE",
        targetTable: "payments",
        targetId: req.params.id,
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Audit Logs (Admin only)
  app.get("/api/audit-logs", requireAuth, requireRole("ADMIN"), async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.listAuditLogs(limit);
      res.json({ logs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
