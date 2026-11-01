import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Each developer points this at their own Render Postgres instance via .env
// (see server/.env.example). Never commit a real .env.
const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
};

export const pool = new pg.Pool(config);
