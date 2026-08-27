import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";

const authSecret = process.env.BETTER_AUTH_SECRET || "rahasia_acak_minimal_32_karakter_untuk_enkripsi_sesi";

const getBaseUrl = () => {
  let url = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (!url) return "http://localhost:3000";
  url = url.trim().replace(/^["']|["']$/g, "").replace(/\\/g, "").trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
};

export const auth = betterAuth({
  appName: "Pendaftaran Lomba Agustusan",
  baseURL: getBaseUrl(),
  secret: authSecret,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: false,
    camelCase: false,
  }),
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "PANITIA"],
        required: false,
        defaultValue: "ADMIN",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const sessionUser = session.user as { role?: string };
  if (sessionUser.role === "ADMIN" || sessionUser.role === "PANITIA") {
    return session;
  }

  const dbUser = await db
    .select({ role: schema.user.role })
    .from(schema.user)
    .where(eq(schema.user.id, session.user.id))
    .limit(1);

  if (!dbUser[0] || (dbUser[0].role !== "ADMIN" && dbUser[0].role !== "PANITIA")) {
    redirect("/login");
  }
  return session;
}
