import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

/* ===== Security ===== */
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET"],
  })
);
app.use(express.json());

/* ===== DB ===== */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 10, // max connection
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

/** Healthcheck untuk Docker */
app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

/** Endpoint komunikasi FE ↔ BE */
app.get("/api/info", async (_: Request, res: Response) => {
  const result = await pool.query<{ name: string }>(
    "SELECT name FROM users LIMIT 1"
  );

  res.json({
    service: "backend",
    message: "Backend berhasil diakses dari Frontend",
    user: result.rows[0]?.name ?? null,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Backend running on port ${process.env.PORT || 3000}`);
});
