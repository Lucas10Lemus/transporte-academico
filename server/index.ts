import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import pgSession from "connect-pg-simple"; // Salva a sessão no banco
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool } from "./db"; 

const app = express();
const PgStore = pgSession(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- SESSÃO ROBUSTA (CORREÇÃO DO LOGIN) ---
app.use(
  session({
    store: new PgStore({
      pool: pool, // Usa seu Docker
      tableName: 'session', // Cria tabela 'session'
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "segredo_padrao",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
      httpOnly: true,
      secure: false, // FALSE para localhost (CRÍTICO!)
      sameSite: "lax",
    },
  })
);

// Log simples e limpo
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    });
  }
  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Tratamento de erro padrão
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    log(`🚀 Servidor rodando em http://localhost:${port}`);
  });
})();