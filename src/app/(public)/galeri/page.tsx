import { desc, eq } from "drizzle-orm";

import { PublicGallery, PublicGalleryItem, FilterOption } from "@/components/site/public-gallery";
import { db } from "@/db";
import { competitions, galleryPhotos, events } from "@/db/schema";

export const metadata = {
  title: "Galeri Momen Semarak 17-an RW 10",
  description: "Arsip dokumentasi dan kemeriahan warga RW 10 dalam perlombaan Hari Kemerdekaan Republik Indonesia ke-81.",
};

const fallbackGalleryItems: PublicGalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop",
    alt: "Anak-anak berlomba balap karung dengan semangat dan tawa riang.",
    categoryId: "fallback-balap",
    categoryLabel: "Balap Karung",
    title: "Start Balap Karung Junior",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=800&auto=format&fit=crop",
    alt: "Peserta balap karung tersenyum lebar sesaat sebelum peluit tanda mulai.",
    categoryId: "fallback-balap",
    categoryLabel: "Balap Karung",
    title: "Fokus di Garis Start",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
    alt: "Keseruan detik-detik menjelang garis finish dihiasi sorak-sorai penonton RT 01-07.",
    categoryId: "fallback-balap",
    categoryLabel: "Balap Karung",
    title: "Sorak Sorai Garis Finish",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    alt: "Ekspresi kocak dan antusiasme tinggi anak-anak dalam lomba makan kerupuk.",
    categoryId: "fallback-kerupuk",
    categoryLabel: "Makan Kerupuk",
    title: "Adu Cepat Makan Kerupuk",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
    alt: "Konsentrasi penuh seorang anak mengusahakan suapan kerupuk pertama.",
    categoryId: "fallback-kerupuk",
    categoryLabel: "Makan Kerupuk",
    title: "Konsentrasi & Gigitan Pertama",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop",
    alt: "Kompaknya regu warga saat berlomba Tarik Tambang memeriahkan suasana sore hari.",
    categoryId: "general",
    categoryLabel: "Momen Warga",
    title: "Kekuatan & Kekompakan Tambang",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    alt: "Warga bersorak girang sambil menyemangati tim kebanggaan RT masing-masing.",
    categoryId: "general",
    categoryLabel: "Momen Warga",
    title: "Semangat Supporter Warga",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    alt: "Senyum bangga segenap panitia karang taruna dan pengurus RW 10 setelah sukses mengadakan acara.",
    categoryId: "general",
    categoryLabel: "Momen Warga",
    title: "Panitia & Karang Taruna RW 10",
    year: "2025",
  },
  {
    src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=800&auto=format&fit=crop",
    alt: "Deretan piala kemakmuran dan berbagai bingkisan doorprize spektakuler untuk para pemenang lomba.",
    categoryId: "general",
    categoryLabel: "Momen Warga",
    title: "Deretan Piala & Doorprize",
    year: "2025",
  },
];

const fallbackFilters: FilterOption[] = [
  { id: "fallback-balap", label: "Balap Karung" },
  { id: "fallback-kerupuk", label: "Makan Kerupuk" },
  { id: "general", label: "Kemeriahan Warga" },
];

export default async function GaleriPage() {
  const [compRows, photoRows] = await Promise.all([
    db.select().from(competitions),
    db.select().from(galleryPhotos).orderBy(desc(galleryPhotos.createdAt)),
  ]);

  const compMap = new Map(compRows.map((c) => [c.id, c.name]));

  // Jika di database ada foto, utamakan foto dari database!
  let items: PublicGalleryItem[];
  let filters: FilterOption[];

  if (photoRows.length > 0) {
    items = photoRows.map((p) => ({
      src: p.imageUrl,
      alt: p.description,
      categoryId: p.competitionId ? String(p.competitionId) : "general",
      categoryLabel: p.competitionId ? compMap.get(p.competitionId) || "Lomba" : "Momen Warga",
      title: p.title,
      year: p.year,
    }));

    const dynamicFilters: FilterOption[] = [
      { id: "general", label: "Momen Warga" },
      ...compRows.map((c) => ({
        id: String(c.id),
        label: c.name,
      })),
    ];
    filters = dynamicFilters;
  } else {
    // Gunakan fallback foto arsip lama bila database masih belum diisi panitia
    items = fallbackGalleryItems;
    filters = fallbackFilters;
  }

  return <PublicGallery items={items} filters={filters} />;
}
