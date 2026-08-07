import { desc } from "drizzle-orm";

import { AdminGalleryClient } from "@/components/site/admin-gallery-client";
import { db } from "@/db";
import { competitions, galleryPhotos } from "@/db/schema";

export const metadata = {
  title: "Manajemen Galeri & Dokumentasi",
  description: "Pengelolaan album foto kenangan perlombaan dan momen warga Semarak HUT RI ke-81.",
};

export default async function PortalGaleriPage() {
  const [compRows, photoRows] = await Promise.all([
    db.select().from(competitions),
    db.select().from(galleryPhotos).orderBy(desc(galleryPhotos.createdAt)),
  ]);

  const compMap = new Map(compRows.map((c) => [c.id, c.name]));

  const formattedPhotos = photoRows.map((photo) => ({
    id: photo.id,
    competitionId: photo.competitionId,
    competitionName: photo.competitionId ? compMap.get(photo.competitionId) || null : null,
    title: photo.title,
    description: photo.description,
    imageUrl: photo.imageUrl,
    year: photo.year,
    createdAt: photo.createdAt,
  }));

  const formattedComps = compRows.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
  }));

  return <AdminGalleryClient initialPhotos={formattedPhotos} competitions={formattedComps} />;
}
