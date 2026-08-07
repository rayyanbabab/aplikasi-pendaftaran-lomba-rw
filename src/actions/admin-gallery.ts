"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { galleryPhotos, user } from "@/db/schema";
import { getSession } from "@/lib/auth";

async function verifyManagerCaller() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Sesi tidak valid atau telah berakhir.");
  }

  const sessionUser = session.user as { role?: string };
  if (sessionUser.role !== "ADMIN" && sessionUser.role !== "PANITIA") {
    const dbUser = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    if (!dbUser[0] || (dbUser[0].role !== "ADMIN" && dbUser[0].role !== "PANITIA")) {
      throw new Error("Akses ditolak. Fitur ini khusus untuk Panitia dan Admin.");
    }
  }
  return session.user;
}

const photoSchema = z.object({
  title: z.string().min(3, "Judul foto minimal 3 karakter").max(100, "Judul foto maksimal 100 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter").max(500, "Deskripsi maksimal 500 karakter"),
  imageUrl: z.string().min(5, "Pilih foto atau masukkan tautan URL gambar yang valid"),
  competitionId: z.string().nullable().optional().transform((val) => {
    if (!val || val === "all" || val === "general" || val === "") return null;
    const num = Number(val);
    return Number.isNaN(num) ? null : num;
  }),
  year: z.string().min(4, "Tahun harus berupa 4 digit").default("2026"),
});

export async function createGalleryPhoto(input: unknown) {
  try {
    await verifyManagerCaller();
    const parsed = photoSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "Input data tidak valid." };
    }

    await db.insert(galleryPhotos).values({
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      competitionId: parsed.data.competitionId,
      year: parsed.data.year,
    });

    revalidatePath("/portal/galeri");
    revalidatePath("/galeri");
    revalidatePath("/");
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Gagal menyimpan foto galeri." };
  }
}

export async function updateGalleryPhoto(id: number, input: unknown) {
  try {
    await verifyManagerCaller();
    const parsed = photoSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "Input data tidak valid." };
    }

    await db
      .update(galleryPhotos)
      .set({
        title: parsed.data.title,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
        competitionId: parsed.data.competitionId,
        year: parsed.data.year,
      })
      .where(eq(galleryPhotos.id, id));

    revalidatePath("/portal/galeri");
    revalidatePath("/galeri");
    revalidatePath("/");
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Gagal memperbarui data foto galeri." };
  }
}

export async function deleteGalleryPhoto(id: number) {
  try {
    await verifyManagerCaller();
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));

    revalidatePath("/portal/galeri");
    revalidatePath("/galeri");
    revalidatePath("/");
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Gagal menghapus foto." };
  }
}
