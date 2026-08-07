import { and, eq, ilike, or } from "drizzle-orm";

import { AdminRegistrations } from "@/components/site/admin-registrations";
import { db } from "@/db";
import { ageCategories, competitions, registrations } from "@/db/schema";

export const metadata = {
  title: "Daftar Warga & Status Registrasi",
  description: "Daftar lengkap pendaftar lomba dan pengelolaan status persetujuan warga.",
};

export default async function AdminPendaftaranPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const parseNumber = (value: string | string[] | undefined) => {
    if (typeof value !== "string") return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const competitionId = parseNumber(params.competitionId);
  const ageCategoryId = parseNumber(params.ageCategoryId);
  const status = typeof params.status === "string" ? params.status : undefined;

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
    conditions.push(eq(registrations.competitionId, competitionId));
  }
  if (ageCategoryId) {
    conditions.push(eq(registrations.ageCategoryId, ageCategoryId));
  }
  if (status) {
    conditions.push(eq(registrations.status, status as any));
  }

  const [data, competitionRows, categoryRows] = await Promise.all([
    db
      .select({
        id: registrations.id,
        publicCode: registrations.publicCode,
        contactName: registrations.contactName,
        contactPhone: registrations.contactPhone,
        status: registrations.status,
        entryType: registrations.entryType,
        createdAt: registrations.createdAt,
        competitionName: competitions.name,
        categoryName: ageCategories.name,
      })
      .from(registrations)
      .leftJoin(competitions, eq(registrations.competitionId, competitions.id))
      .leftJoin(ageCategories, eq(registrations.ageCategoryId, ageCategories.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(registrations.createdAt),
    db.select().from(competitions),
    db.select().from(ageCategories),
  ]);

  const exportQuery = new URLSearchParams();
  if (q) exportQuery.set("q", q);
  if (competitionId) exportQuery.set("competitionId", String(competitionId));
  if (ageCategoryId) exportQuery.set("ageCategoryId", String(ageCategoryId));
  if (status) exportQuery.set("status", status);

  return (
    <AdminRegistrations
      registrations={data.map((row) => ({
        id: row.id,
        publicCode: row.publicCode,
        contactName: row.contactName,
        contactPhone: row.contactPhone,
        status: row.status,
        entryType: row.entryType,
        createdAt: row.createdAt.toISOString(),
        competitionName: row.competitionName ?? "-",
        categoryName: row.categoryName ?? "-",
      }))}
      competitions={competitionRows.map((competition) => ({
        id: competition.id,
        name: competition.name,
      }))}
      categories={categoryRows.map((category) => ({
        id: category.id,
        competitionId: category.competitionId,
        name: category.name,
      }))}
      filters={{ q, competitionId, ageCategoryId, status }}
      exportUrl={`/portal/pendaftaran/export?${exportQuery.toString()}`}
    />
  );
}
