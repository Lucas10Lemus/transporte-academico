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
      if (existingUser) return res.status(400).json({ error: "Email already registered" });

      const passwordHash = await hashPassword(userData.passwordHash);
      const user = await storage.createUser({ ...userData, passwordHash });

      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "CREATE",
        targetTable: "users",
        targetId: user.id,
      });

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });

      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) return res.status(401).json({ error: "Invalid credentials" });

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

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
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Failed to logout" });
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const { passwordHash: _, ...userWithoutPassword } = req.user!;
    res.json({ user: userWithoutPassword });
  });

  // --- ROTAS DE PRESENÇA (ALUNO) ---
  app.get("/api/presence/today", requireAuth, async (req, res) => {
    try {
      const studentId = req.user!.id;
      const today = new Date();
      // Zera hora para buscar apenas pela data
      today.setHours(0, 0, 0, 0); 
      const presence = await storage.getDailyPresence(studentId, today);
      res.json({ presence: presence || null });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/presence", requireAuth, requireRole("STUDENT", "COORDINATOR", "ADMIN"), async (req, res) => {
    try {
      const studentId = (req.user!.role === "STUDENT") ? req.user!.id : req.body.studentId;
      if (!studentId) return res.status(400).json({ error: "Student ID required" });

      // Data de hoje YYYY-MM-DD
      const dateStr = new Date().toISOString().split('T')[0];

      const presenceData = {
        studentId,
        date: dateStr,
        statusIda: req.body.statusIda,
        statusVolta: req.body.statusVolta,
        observation: req.body.observation
      };

      const result = await storage.markPresence(presenceData);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        actionType: "UPDATE_PRESENCE",
        targetTable: "daily_presence",
        targetId: result.id,
        changes: JSON.stringify({ ida: result.statusIda, volta: result.statusVolta })
      });

      res.json({ presence: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- ROTA DO MOTORISTA (LISTA DO DIA) ---
  app.get("/api/driver/manifest", requireAuth, requireRole("DRIVER", "ADMIN", "COORDINATOR"), async (req, res) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Admin pode ver lista de qualquer motorista (se passar ?driverId=X)
      const targetDriverId = (req.user!.role === "ADMIN" && req.query.driverId) 
        ? String(req.query.driverId) 
        : req.user!.id;

      const manifest = await storage.getDriverManifest(targetDriverId, todayStr);
      res.json({ manifest });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- ROTAS PADRÃO (Users, Routes, Enrollments...) ---
  
  app.get("/api/users", requireAuth, requireRole("ADMIN", "COORDINATOR"), async (req, res) => {
    const users = await storage.listUsers();
    const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
  });

  app.get("/api/routes", requireAuth, async (req, res) => {
    const routes = await storage.listRoutes();
    res.json({ routes });
  });

  const httpServer = createServer(app);
  return httpServer;
}