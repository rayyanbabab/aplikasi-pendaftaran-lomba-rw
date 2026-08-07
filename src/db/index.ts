import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL belum diatur");
}

const client = postgres(databaseUrl, {
  prepare: false,
});

export const db = drizzle(client, { schema });
export type DbClient = typeof db;
