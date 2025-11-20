import { defineConfig } from "drizzle-kit";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env file");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  driver: "pg", // <--- A VERSÃO 0.20 USA ISSO
  dbCredentials: {
    connectionString: process.env.DATABASE_URL, // <--- E ISSO (NÃO É 'url')
  },
  verbose: true,
  strict: true,
});