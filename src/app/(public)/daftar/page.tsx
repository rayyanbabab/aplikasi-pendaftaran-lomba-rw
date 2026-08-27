import { db } from "@/db";
import { ageCategories, competitions, events, registrations } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { DaftarCatalog, type DaftarCatalogItem } from "@/components/site/daftar-catalog";

export const metadata = {
  title: "Semua Lomba & Pendaftaran Resmi RW 10",
  description:
    "Katalog lengkap seluruh cabang perlombaan HUT RI ke-81 di lingkungan RW 10. Daftarkan diri secara cepat dan gratis tanpa akun.",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
];

const fallbackCategoryLabels = [
  "Kategori Anak & Remaja",
  "Semua Umur Warga",
  "Kategori Beregu Tim",
  "Kategori Dewasa Pria",
  "Kategori Ibu-ibu & Ibu PKK",
  "Umum & Keluarga",
];

type CompetitionRow = Partial<typeof competitions.$inferSelect> & { id: number; name: string; type: "SOLO" | "TEAM" | "BOTH"; quotaTotal?: number | null; eventId?: number; currentCount?: number; maxParticipants?: number; description?: string | null };

export default async function DaftarPage() {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.isOpen, true))
    .limit(1);

  const competitionRows = event
    ? await db
        .select()
        .from(competitions)
        .where(eq(competitions.eventId, event.id))
    : [];

  const competitionIds = competitionRows.map((c) => c.id);
  
  const [categoryRows, registrationCounts] = competitionIds.length
    ? await Promise.all([
        db
          .select()
          .from(ageCategories)
          .where(inArray(ageCategories.competitionId, competitionIds)),
        db
          .select({
            competitionId: registrations.competitionId,
            total: sql<number>`count(*)`,
          })
          .from(registrations)
          .where(inArray(registrations.competitionId, competitionIds))
          .groupBy(registrations.competitionId),
      ])
    : [[], []];

  const categoriesByCompetition = categoryRows.reduce<Record<number, typeof categoryRows>>(
    (acc, category) => {
      acc[category.competitionId] = acc[category.competitionId] ?? [];
      acc[category.competitionId].push(category);
      return acc;
    },
    {}
  );

  const countsByCompetition = registrationCounts.reduce<Record<number, number>>(
    (acc, item) => {
      acc[item.competitionId] = Number(item.total);
      return acc;
    },
    {}
  );

  const competitionsToShow: CompetitionRow[] = competitionRows.length
    ? competitionRows
    : [
        { id: 101, name: "Balap Karung Helmet Junior", type: "SOLO", quotaTotal: 50, currentCount: 42, eventId: 1, maxParticipants: 50 },
        { id: 102, name: "Makan Kerupuk Gila Bergantung", type: "SOLO", quotaTotal: 80, currentCount: 65, eventId: 1, maxParticipants: 80 },
        { id: 103, name: "Tarik Tambang Antar Blok RT", type: "TEAM", quotaTotal: 16, currentCount: 12, eventId: 1, maxParticipants: 16 },
        { id: 104, name: "Panjat Pinang Makmur RW 10", type: "TEAM", quotaTotal: 8, currentCount: 6, eventId: 1, maxParticipants: 8 },
        { id: 105, name: "Lari Kelereng Dalam Sendok", type: "SOLO", quotaTotal: 40, currentCount: 28, eventId: 1, maxParticipants: 40 },
        { id: 106, name: "Balap Bakiak Estafet Warga", type: "TEAM", quotaTotal: 12, currentCount: 9, eventId: 1, maxParticipants: 12 },
      ];

  const catalogItems: DaftarCatalogItem[] = competitionsToShow.map((comp, index) => {
    const categories = comp.id ? categoriesByCompetition[comp.id] ?? [] : [];
    const categoryLabel =
      categories[0]?.name ?? fallbackCategoryLabels[index % fallbackCategoryLabels.length];
    const count =
      countsByCompetition[comp.id] ??
      ("currentCount" in comp ? comp.currentCount ?? 0 : 0);
    const image = fallbackImages[index % fallbackImages.length];
    const quotaTotal = comp.quotaTotal ?? comp.maxParticipants ?? null;
    const isTeam = comp.type === "TEAM" || comp.type === "BOTH";
    
    const countLabel = quotaTotal ? `${count}/${quotaTotal}` : `${count}`;
    const countSuffix = isTeam ? "Tim" : "Peserta";
    
    const description = comp.description && comp.description.length > 5
      ? comp.description
      : `Perlombaan bergengsi berformat ${isTeam ? "regu tim kolaboratif" : "individu pejuang"}. Raih trofi juara dan jadilah kebanggaan tetangga!`;

    return {
      id: comp.id,
      name: comp.name || "Lomba Semarak Kemerdekaan",
      categoryLabel,
      countLabel,
      countSuffix,
      description,
      image,
      type: comp.type || "SOLO",
      href: comp.id < 100 ? `/daftar/${comp.id}` : "/#lomba", // Rute langsung ke form resmi (jika fallback <100 merujuk #lomba)
    };
  });

  return (
    <main className="min-h-screen w-full py-12">
      <DaftarCatalog items={catalogItems} />
    </main>
  );
}
