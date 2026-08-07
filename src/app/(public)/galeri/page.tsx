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
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcfd6JiPtQHeEZHltfvG2QCB4iWX4m6ZwiEvqKnEOnQDPAeLwEjYxCZgCGZHHBq5VhcfLXxZ-D0LRLPr9AuwDlthunY8Yi3xHFGvO9f8mXvP6dZRbNQnOHgLMRNryVwzb0uu_8ph9fRJCD-4_dVuNVPUJgItaUmE9Jrtpf3XyIv_Yp-Hnow6bs1ZuOW5wBd-cTdsLLAn1Ql7bKbN3LJFh-xpTOmdlx2WHq09O_ZlwVSz1fQ7KYkpKFIQRokUEJis597m0a8FkgyvKh",
    alt: "Anak-anak berlomba balap karung dengan semangat keteledoran dan tawa riang.",
    categoryId: "fallback-balap",
    categoryLabel: "Balap Karung",
    title: "Start Balap Karung Junior",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2fWjBlQRL1CLiO5CO9Eur8jvt1JrfW5SvOTmbdbGgL4MJYDzM4SQuSSJJIiJQBuscwP4DKBzEv_KvtfKTW91T75fe87rDAwj9YnldooMcQKDsw6kIo7uhtdHFv2a_IiRUxGy7tsTQ4rxbMJgE1xLpswxkqNUK27hKv8EGYWJ-QRpQkFAjPY_6Wk4lD7SgcfwoAsqwN200t4NXwhL9QagzM2JRCOKhX5OSVFPxsUOIY1gY1MYyKKlng2fxJlV8h0UEmBm0cAzPmedO",
    alt: "Peserta balap karung tersenyum lebar sesaat sebelum cermin tiup pluit tanda mulai.",
    categoryId: "fallback-balap",
    categoryLabel: "Balap Karung",
    title: "Fokus di Garis Start",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA11STQmsEoT28J-4Qu16mS45ekTCGS3aZd5TIdnFAj50XDI8TG0l3qDo4C1NPAfOSrJtJRAjsEES_O9O4QXUS3Zz-y3HVtxcaQBsK9KJlDqeF5fEyNMbK5xyHudqJJu22Avyej5opEwUTyFK87Hb7tNwuZyWIRQz3-3bn18cgWB5M3s7CdGfAYNOdB6yYDttQjE_46QxHM_t5WoXQ0Vo7jwX68Mi4n8RGNcSlT0jQf6bmI8WrWRcAOTClcnxY9TcaRdLJajfDa7xUQ",
    alt: "Keseruan detik-detik menjelang garis finish dihiasi sorak-sorai penonton RT 01-07.",
    categoryId: "fallback-balap",
    categoryLabel: "Balap Karung",
    title: "Sorak Sorai Garis Finish",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiEUKvoyDVXKsHmojo80XyePm4vJywQayV62FX7kifKOI8AN_aQPoRZO9IT-Lbj4TZ81UNIn1TcPgu0_Mlux2Jhzx8EPOY5W_cUf8i__LFN-sSpcndZp1dIuWATYej0BdR2Q0H4-a6bDo9jF0LM2iEN1OF6SG3BhFGungEyHgTbJ-RnA75lIDwfn-DjLKVlrdACcWSTzT61aiMI_L55LCmu-03DJQg0Pk9zA1xP9FcQt7OvUJxG6BqrQkKlyXel3z1TXISrQi5_YRz",
    alt: "Ekspresi kocak dan antusiasme tinggi anak-anak dalam meniti kerupuk bergelayung.",
    categoryId: "fallback-kerupuk",
    categoryLabel: "Makan Kerupuk",
    title: "Adu Cepat Makan Kerupuk",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdSpl6bt4FGW5O17IniIkyT4Wm3aiEpJbpVCDj9P5AqWASCGfM7vu_J_AaWUQBWzW3rs5BBO_9eKPx5T4cMCZiERAv-jdOtY_tr8FCChYjhhQx-iIdASlJ5YPtU6oJBjRbUGoV3blfX-hLR-GCNlp80fqPpa4d3HEbmOs7jPSZMtze384W8kk2XuiqWU7ZhZWxbpoXFeFN6lDF0JhKos6lyQMoPLYiuV5C4XpjqeaFBW4qIZ-zcsYXgl9rvmAl3fqwvaGDi0nLTDt",
    alt: "Konsentrasi penuh seorang adik perempuan mengusahakan suapan kerupuk pertama.",
    categoryId: "fallback-kerupuk",
    categoryLabel: "Makan Kerupuk",
    title: "Konsentrasi & Gigitan Pertama",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTILYtvkKR8JcIZjB9d8m0VJdS2OPIlKChClCBz_lVLwdDKFxQRltT4UNJebo4azy_hLghMML_0wMbIOpXdKA4mHp0LFqUwKiwD7XaTH7Uj2xnbJULPwhPxn0c0lBKpJd9GfIHqSvWTw0hIN8Ld2l40xBJpN7eI8wOi1P4AqRhRaTQcy59PibRldWYW5rMJWXpT-lmqYpt-v-h07SNVF3OFlFJyb99Rk_30L7UI_JBmy5mLkO1eqpEjIdjrWuJFNL84wqYf1-RdZG0",
    alt: "Kompaknya regu warga saat berlomba Tarik Tambang memeriahkan suasana sore hari.",
    categoryId: "general",
    categoryLabel: "Momen Warga",
    title: "Kekuatan & Kekompakan Tambang",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw6WVcvJJHfGEdwwhwOa-6XFigIEfC9Yp0KAZYK9ARIQMfPco6R9epHsV3vEAHjCHh5081Lj_bsuNRLVbc9JNuTp52BdjK60GNHEfc2IafeWJ112RRdrH158nB5Yhjy7lwkobtRFfryTTrWNEQQPk42-wsWQlgqChdz8qIHqNrGzaR0tryYtXIahUS8KpYsmcarRjUH6SCEjp33fuSxD5i9Dhg3c-_U2qRcw_A92P3gralymmLxmluWaPOhme6UCDyJL7ceD_0F1mb",
    alt: "Warga bersorak girang sambil melampakan bendera menyemangati tim kebanggaan RT masing-masing.",
    categoryId: "general",
    categoryLabel: "Momen Warga",
    title: "Semangat Supporter Warga",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOLW6dYMxiaL8V6m0KBtpcJlFCbMBKG3Hr4HkzROaKsrrYNqeqJ3OIfzgpxhDZjmyaqqyhjuUoJ4b3PfN5Z7f0OY6hYt37Grkp6JiISLceXslvzk_DHHTWmRuOtaeOHdWA_AUtGzs_2ozo0hG5XDOHmle1dolzBbXhwzC0dXjC0rBRX6xfrq2ldtKz_htBT0zbwihJGHri13nzrF9Um66fXS9Gd2bpMqi_yoY21ggg0WwtTNnx8u4n6mmH0gEA2Lq6qhmfkIdZ_M65",
    alt: "Senyum bangga segenap panitia karang taruna dan pengurus RW 10 setelah sukses mengadakan acara.",
    categoryId: "general",
    categoryLabel: "Momen Warga",
    title: "Panitia & Karang Taruna RW 10",
    year: "2025",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzQ6Y0HKLRl_VXsdAUoscF-0PcL_apVDn4dOBl9tGSdXdN5nexXHWHa0TQ-rTVmz_fxr5zWa58YleXcn9QQagxcxuSR_LOXOVJKf5CRY8gS8ShCwGubgyLICqHE-LXu6QYcMEFL262XCZOoKpxGtAFXMXQnk9IkSrBw8cZziofreVFFuyHt2M_78niTCyhrBO_4K86Y177UGk2a0L-1xLzS3hVBk_ebzDlCOLg1V9A6APnQdUuMsIDv3Zhin_Q5PfEjc8fr_YX9OyI",
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
