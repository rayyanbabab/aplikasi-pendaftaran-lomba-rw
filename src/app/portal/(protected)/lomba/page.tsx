import { AdminCompetitionManager } from "@/components/site/admin-competitions";
import { db } from "@/db";
import { ageCategories, competitions, events } from "@/db/schema";

export const metadata = {
  title: "Manajemen Cabang Lomba & Usia",
  description: "Pengelolaan daftar cabang perlombaan dan kategori usia peserta Semarak HUT RI ke-81.",
};

export default async function AdminLombaPage() {
  const [eventRows, competitionRows, categoryRows] = await Promise.all([
    db.select().from(events),
    db.select().from(competitions),
    db.select().from(ageCategories),
  ]);

  return (
    <AdminCompetitionManager
      events={eventRows.map((event) => ({
        id: event.id,
        name: event.name,
        location: event.location,
      }))}
      competitions={competitionRows.map((competition) => ({
        id: competition.id,
        eventId: competition.eventId,
        name: competition.name,
        type: competition.type,
        quotaTotal: competition.quotaTotal,
        minMembers: competition.minMembers,
        maxMembers: competition.maxMembers,
      }))}
      categories={categoryRows.map((category) => ({
        id: category.id,
        competitionId: category.competitionId,
        name: category.name,
        ageMin: category.ageMin,
        ageMax: category.ageMax,
      }))}
    />
  );
}
