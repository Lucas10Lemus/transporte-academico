import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Cria a conexão padrão TCP (compatível com Docker)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializa o Drizzle ORM
export const db = drizzle(pool, { schema });