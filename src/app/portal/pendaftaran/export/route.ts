import { and, eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { ageCategories, competitions, registrations } from "@/db/schema";
import { auth } from "@/lib/auth";

function escapeCsv(value: string | number | null) {
  const text = value === null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const competitionId = url.searchParams.get("competitionId");
  const ageCategoryId = url.searchParams.get("ageCategoryId");
  const status = url.searchParams.get("status");

  const conditions = [];
  if (q) {
    conditions.push(
      or(
        ilike(registrations.contactName, `%${q}%`),
        ilike(registrations.contactPhone, `%${q}%`),
        ilike(registrations.publicCode, `%${q}%`),
      ),
    );
  }
  if (competitionId) {
    conditions.push(eq(registrations.competitionId, Number(competitionId)));
  }
  if (ageCategoryId) {
    conditions.push(eq(registrations.ageCategoryId, Number(ageCategoryId)));
  }
  if (status) {
    conditions.push(eq(registrations.status, status as any));
  }

  const rows = await db
    .select({
      publicCode: registrations.publicCode,
      contactName: registrations.contactName,
      contactPhone: registrations.contactPhone,
      status: registrations.status,
      entryType: registrations.entryType,
      competitionName: competitions.name,
      categoryName: ageCategories.name,
      createdAt: registrations.createdAt,
    })
    .from(registrations)
    .leftJoin(competitions, eq(registrations.competitionId, competitions.id))
    .leftJoin(ageCategories, eq(registrations.ageCategoryId, ageCategories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(registrations.createdAt);

  const header = [
    "public_code",
    "contact_name",
    "contact_phone",
    "status",
    "entry_type",
    "competition",
    "category",
    "created_at",
  ];

  const lines = [header.join(",")];

  for (const row of rows) {
    lines.push(
      [
        row.publicCode,
        row.contactName,
        row.contactPhone,
        row.status,
        row.entryType,
        row.competitionName ?? "",
        row.categoryName ?? "",
        row.createdAt.toISOString(),
      ]
        .map((value) => escapeCsv(value))
        .join(","),
    );
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=pendaftaran.csv",
    },
  });
}
