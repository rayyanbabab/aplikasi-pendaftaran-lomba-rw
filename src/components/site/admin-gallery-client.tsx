"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Camera, 
  Plus, 
  Trash2, 
  Pencil, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Upload, 
  X, 
  Sparkles, 
  Trophy, 
  Filter, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { createGalleryPhoto, deleteGalleryPhoto, updateGalleryPhoto } from "@/actions/admin-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PhotoItem = {
  id: number;
  competitionId: number | null;
  competitionName?: string | null;
  title: string;
  description: string;
  imageUrl: string;
  year: string;
  createdAt: Date;
};

type CompetitionItem = {
  id: number;
  name: string;
  type: string;
};

export function AdminGalleryClient({
  initialPhotos,
  competitions,
}: {
  initialPhotos: PhotoItem[];
  competitions: CompetitionItem[];
}) {
  const router = useRouter();
  const [photos, setPhotos] = React.useState<PhotoItem[]>(initialPhotos);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [isPending, startTransition] = React.useTransition();

  // Modal States
  const [isOpenAdd, setIsOpenAdd] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<PhotoItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<PhotoItem | null>(null);

  // Form States (Add/Edit)
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [competitionId, setCompetitionId] = React.useState("general");
  const [year, setYear] = React.useState("2026");
  const [uploadMode, setUploadMode] = React.useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = React.useState("");
  const [previewUrl, setPreviewUrl] = React.useState("");

  React.useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCompetitionId("general");
    setYear("2026");
    setUploadMode("file");
    setImageUrl("");
    setPreviewUrl("");
  };

  const openAddModal = () => {
    resetForm();
    setIsOpenAdd(true);
  };

  const openEditModal = (item: PhotoItem) => {
    setTitle(item.title);
    setDescription(item.description);
    setCompetitionId(item.competitionId !== null ? String(item.competitionId) : "general");
    setYear(item.year);
    if (item.imageUrl.startsWith("data:")) {
      setUploadMode("file");
    } else {
      setUploadMode("url");
    }
    setImageUrl(item.imageUrl);
    setPreviewUrl(item.imageUrl);
    setEditTarget(item);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const TARGET_MAX_BYTES = 300 * 1024; // 300 KB - Batas ideal maksimal berat foto di web
        let maxDimension = 1400; // Resolusi awal HD pro-grade
        let quality = 0.85;

        const getRescaledDimensions = (dim: number) => {
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > dim) {
              h = Math.round((h * dim) / w);
              w = dim;
            }
          } else {
            if (h > dim) {
              w = Math.round((w * dim) / h);
              h = dim;
            }
          }
          return { w, h };
        };

        let { w, h } = getRescaledDimensions(maxDimension);
        canvas.width = w;
        canvas.height = h;
        let ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);

        const rawDataUrl = event.target?.result as string;
        let canvasDataUrl = canvas.toDataURL("image/jpeg", quality);
        let compressedBytes = Math.round((canvasDataUrl.length * 3) / 4);
        const originalBytes = file.size;

        // ADAPTIVE TARGET COMPRESSION ENGINE:
        // Jika file asli beratnya di atas 300 KB, tapi hasil kompresi pertama masih di atas 300 KB atau di atas ukuran asli,
        // turunkan kualitas secara bertahap sampai ukurannya pas di bawah 300 KB (atau jauh di bawah file asli)!
        if (originalBytes > TARGET_MAX_BYTES) {
          while ((compressedBytes > TARGET_MAX_BYTES || compressedBytes >= originalBytes) && quality > 0.65) {
            quality -= 0.07;
            canvasDataUrl = canvas.toDataURL("image/jpeg", quality);
            compressedBytes = Math.round((canvasDataUrl.length * 3) / 4);
          }
          // Jika sudah quality 0.65 tapi masih melambung, kecilkan resolusinya ke 1080px (Full HD standar web)
          if (compressedBytes > TARGET_MAX_BYTES || compressedBytes >= originalBytes) {
            maxDimension = 1080;
            const rescaled = getRescaledDimensions(maxDimension);
            canvas.width = rescaled.w;
            canvas.height = rescaled.h;
            ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, rescaled.w, rescaled.h);
            canvasDataUrl = canvas.toDataURL("image/jpeg", 0.78);
            compressedBytes = Math.round((canvasDataUrl.length * 3) / 4);
          }
        }

        // SMART SIZE SAFEGUARD:
        // Tetap pastikan untuk file kecil (seperti 55 KB) tidak akan pernah naik dari file asli!
        const finalDataUrl = compressedBytes >= originalBytes ? rawDataUrl : canvasDataUrl;
        const finalBytes = compressedBytes >= originalBytes ? originalBytes : compressedBytes;

        const originalSizeKB = Math.round(originalBytes / 1024);
        const originalSizeMB = (originalBytes / (1024 * 1024)).toFixed(2);
        const finalSizeKB = Math.round(finalBytes / 1024);
        const savedPct = Math.max(0, Math.round((1 - finalBytes / originalBytes) * 100));

        setImageUrl(finalDataUrl);
        setPreviewUrl(finalDataUrl);

        if (compressedBytes >= originalBytes && originalBytes <= TARGET_MAX_BYTES) {
          toast.success(`✨ Foto sudah berukuran ringan (${finalSizeKB} KB / di bawah standar 300 KB) dan diunggah murni tanpa modifikasi!`);
        } else if (originalBytes > 1024 * 500) {
          toast.success(`✨ Foto besar (${originalSizeMB} MB) berhasil dipangkas ke ${finalSizeKB} KB (Hemat ${savedPct}%) dengan kualitas HD!`, { duration: 5000 });
        } else if (compressedBytes < originalBytes) {
          toast.success(`✨ Foto berhasil diredam dari ${originalSizeKB} KB menjadi ${finalSizeKB} KB! (Hemat ${savedPct}%)`);
        } else {
          toast.success(`✨ Foto siap diunggah pada ukuran optimal ${finalSizeKB} KB.`);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
      toast.error("Harap isi seluruh kolom yang diwajibkan dan pilih foto.");
      return;
    }

    startTransition(async () => {
      const res = await createGalleryPhoto({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        competitionId: competitionId === "general" ? null : competitionId,
        year: year.trim() || "2026",
      });

      if (!res.ok) {
        toast.error(res.error || "Gagal mengunggah foto ke galeri.");
        return;
      }

      toast.success("Foto berhasil diunggah ke Galeri RW 10.");
      setIsOpenAdd(false);
      resetForm();
      router.refresh();
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
      toast.error("Harap isi seluruh kolom yang diwajibkan dan pilih foto.");
      return;
    }

    startTransition(async () => {
      const res = await updateGalleryPhoto(editTarget.id, {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        competitionId: competitionId === "general" ? null : competitionId,
        year: year.trim() || "2026",
      });

      if (!res.ok) {
        toast.error(res.error || "Gagal memperbarui data foto.");
        return;
      }

      toast.success("Data foto berhasil diperbarui.");
      setEditTarget(null);
      resetForm();
      router.refresh();
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteGalleryPhoto(deleteTarget.id);
      if (!res.ok) {
        toast.error(res.error || "Gagal menghapus foto.");
        return;
      }
      toast.success("Foto telah dihapus dari galeri.");
      setDeleteTarget(null);
      router.refresh();
    });
  };

  const filteredPhotos = React.useMemo(() => {
    if (selectedCategory === "all") return photos;
    if (selectedCategory === "general") {
      return photos.filter((p) => p.competitionId === null);
    }
    return photos.filter((p) => String(p.competitionId) === selectedCategory);
  }, [photos, selectedCategory]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-12 pb-14">
      {/* HEADER: Structural & simple sesuai standar dasbor Anti-Slop */}
      <section className="flex flex-col justify-between gap-6 border-b border-border pb-7 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Manajemen Galeri & Foto
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Kelola arsip dokumentasi lomba, foto kemeriahan warga, serta penayangan momen di galeri publik RW 10.
          </p>
        </div>

        <Button
          type="button"
          onClick={openAddModal}
          className="h-11 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-5 font-bold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:from-[#e01d1d] hover:to-[#c91818] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] shrink-0 cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Unggah Foto Baru
        </Button>
      </section>

      {/* CATALOG & FILTERS */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
          <h2 className="text-base font-bold text-foreground">
            Daftar Momen Tersimpan ({photos.length})
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-xl px-3.5 text-xs font-semibold transition-colors cursor-pointer border",
                selectedCategory === "all"
                  ? "bg-[#ee2b2b]/10 text-[#ee2b2b] border-[#ee2b2b]/30 font-bold dark:bg-red-500/15 dark:text-red-400"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              Semua ({photos.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("general")}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-xl px-3.5 text-xs font-semibold transition-colors cursor-pointer border gap-1.5",
                selectedCategory === "general"
                  ? "bg-[#ee2b2b]/10 text-[#ee2b2b] border-[#ee2b2b]/30 font-bold dark:bg-red-500/15 dark:text-red-400"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              Momen Warga ({photos.filter((p) => p.competitionId === null).length})
            </button>
            {competitions.map((c) => {
              const count = photos.filter((p) => p.competitionId === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(String(c.id))}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-xl px-3.5 text-xs font-semibold transition-colors cursor-pointer border gap-1.5",
                    selectedCategory === String(c.id)
                      ? "bg-[#ee2b2b]/10 text-[#ee2b2b] border-[#ee2b2b]/30 font-bold dark:bg-red-500/15 dark:text-red-400"
                      : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Trophy className="h-3 w-3 opacity-70" />
                  {c.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* GRID KARTU DASBOR STRUKTURAL & RAPI */}
        {filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-3 bg-muted/10">
            <ImageIcon className="mx-auto h-10 w-10 opacity-40" />
            <div>
              <p className="text-sm font-semibold text-foreground">Belum ada foto pada kategori ini</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tekan tombol &quot;Unggah Foto Baru&quot; di atas untuk mulai menambahkan dokumentasi.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => {
              const isComp = photo.competitionId !== null;
              const isExternal = photo.imageUrl.startsWith("http");
              return (
                <div key={photo.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden">
                  <div>
                    <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden border-b border-border flex items-center justify-center">
                      {isExternal ? (
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      )}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md border",
                          isComp
                            ? "bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40 bg-card/90"
                            : "bg-red-500/20 text-red-900 dark:text-red-200 border-red-500/40 bg-card/90"
                        )}>
                          {isComp ? <Trophy className="h-3 w-3 inline text-amber-500" /> : <Sparkles className="h-3 w-3 inline text-[#ee2b2b]" />}
                          <span>{photo.competitionName || "Momen Warga"}</span>
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center rounded-md bg-zinc-900/80 text-white px-2 py-0.5 text-[11px] font-bold backdrop-blur-md border border-white/20">
                          {photo.year}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-foreground line-clamp-1">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-muted/20 border-t border-border/70">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(photo)}
                      className="h-9 rounded-xl border-border px-3.5 text-xs font-semibold hover:bg-muted cursor-pointer"
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(photo)}
                      className="h-9 rounded-xl border-border px-3.5 text-xs font-semibold text-red-600 hover:bg-red-500/10 hover:text-red-700 hover:border-red-500/30 cursor-pointer"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 🚀 MODAL TAMBAH & EDIT FOTO (SERAGAM DENGAN MODAL LOMBA)  */}
      {/* ========================================================= */}
      {mounted && (isOpenAdd || editTarget !== null) && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative my-auto w-full max-w-lg shrink-0 transition-transform">
            <Card className="w-full border-2 border-border/80 bg-white dark:bg-[#171313] text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.7)] opacity-100 animate-scale-in overflow-hidden rounded-2xl">
              <CardHeader className="border-b border-border/60 bg-gray-50/90 dark:bg-[#201919] pb-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2.5 text-xl font-black text-foreground">
                    <Camera className="h-5 w-5 text-[#ee2b2b]" />
                    {editTarget ? "Edit Data Foto Galeri" : "Unggah Foto Baru"}
                  </CardTitle>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenAdd(false);
                      setEditTarget(null);
                      resetForm();
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <CardDescription className="mt-1 font-medium">
                  {editTarget ? "Sesuaikan judul, deskripsi, atau ganti gambar dokumentasi di bawah ini." : "Lengkapi data dokumentasi dan unggah foto perayaan warga RW 10."}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 bg-white dark:bg-[#171313]">
                <form onSubmit={editTarget ? handleSaveEdit : handleSaveAdd} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-foreground">
                      Judul Foto <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      placeholder="Contoh: Sang Juara Bertahan Balap Karung"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium transition-all focus:border-[#ee2b2b] focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-sm font-bold text-foreground">
                        Kategori / Lomba <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={competitionId}
                        onChange={(e) => setCompetitionId(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-white dark:bg-[#201919] px-3.5 text-sm font-medium text-foreground focus:border-[#ee2b2b] focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                      >
                        <option value="general">✨ Umum / Momen Warga</option>
                        {competitions.map((comp) => (
                          <option key={comp.id} value={String(comp.id)}>
                            🏆 {comp.name} ({comp.type === "TEAM" ? "Regu" : "Individu"})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-foreground">
                        Tahun <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        required
                        maxLength={4}
                        placeholder="2026"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-foreground">
                      Deskripsi Momen <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Ceritakan keseruan momen atau atmosfer riang gembira pada foto ini..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white dark:bg-[#201919] p-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-[#ee2b2b] focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>

                  {/* SUMBER GAMBAR (FILE OR URL) */}
                  <div className="space-y-2 pt-2 border-t border-border/70">
                    <Label className="text-sm font-bold text-foreground">
                      Sumber Foto <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadMode("file")}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold border transition-all cursor-pointer",
                          uploadMode === "file"
                            ? "border-[#ee2b2b] bg-[#ee2b2b]/10 text-[#ee2b2b] font-extrabold dark:bg-red-500/15 dark:text-red-400"
                            : "border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        File Komputer / HP
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode("url")}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold border transition-all cursor-pointer",
                          uploadMode === "url"
                            ? "border-[#ee2b2b] bg-[#ee2b2b]/10 text-[#ee2b2b] font-extrabold dark:bg-red-500/15 dark:text-red-400"
                            : "border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        Tautan URL Eksternal
                      </button>
                    </div>

                    {uploadMode === "file" ? (
                      <div className="relative rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-[#ee2b2b]/60 bg-muted/10 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 z-10 h-full w-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-1.5">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="text-xs font-bold text-foreground">
                            Klik atau Tarik Foto dari Perangkat Anda
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Mendukung JPG, PNG, WEBP &middot; Diproses hemat memori secara otomatis
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Input
                        type="text"
                        placeholder="Tempel (Ctrl+V) tautan URL foto dari internet atau cloud..."
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setPreviewUrl(e.target.value);
                        }}
                        className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-xs font-medium"
                      />
                    )}

                    {previewUrl && (
                      <div className="relative mt-3 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-black/95 p-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-full max-w-full rounded-lg object-contain transition-opacity duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity = "0.25";
                          }}
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).style.opacity = "1";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl("");
                            setPreviewUrl("");
                          }}
                          className="absolute top-2.5 right-2.5 rounded-lg bg-red-600 p-1.5 text-white shadow-md hover:bg-red-700 transition-transform hover:scale-105 cursor-pointer z-10"
                          title="Hapus gambar terpilih"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsOpenAdd(false);
                        setEditTarget(null);
                        resetForm();
                      }}
                      className="h-11 rounded-xl text-sm font-semibold cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !imageUrl.trim()}
                      className="h-11 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-6 text-sm font-bold text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818] cursor-pointer disabled:opacity-50"
                    >
                      {isPending ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Unggah Sekarang"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 🗑️ MODAL KONFIRMASI HAPUS FOTO (SERAGAM DENGAN DASBOR)     */}
      {/* ========================================================= */}
      {mounted && deleteTarget !== null && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative my-auto w-full max-w-md shrink-0 transition-transform">
            <Card className="w-full border-2 border-red-500/40 bg-white dark:bg-[#171313] text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.7)] opacity-100 animate-scale-in overflow-hidden rounded-2xl">
              <CardHeader className="border-b border-border/60 bg-red-50/50 dark:bg-red-950/20 pb-5">
                <div className="flex items-center gap-2.5 text-lg font-black text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>Hapus Foto dari Galeri?</span>
                </div>
                <CardDescription className="mt-1 text-xs font-medium text-muted-foreground">
                  Tindakan ini permanen dan akan segera menghapus tayangan foto ini dari web publik.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 bg-white dark:bg-[#171313] space-y-4">
                <div className="rounded-xl border border-border/80 bg-muted/30 p-3 flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-black shrink-0 flex items-center justify-center">
                    {deleteTarget.imageUrl.startsWith("http") ? (
                      <img src={deleteTarget.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Image src={deleteTarget.imageUrl} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-foreground truncate">{deleteTarget.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{deleteTarget.description}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeleteTarget(null)}
                    className="h-10 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={confirmDelete}
                    className="h-10 rounded-xl bg-red-600 hover:bg-red-700 px-5 text-xs font-bold text-white shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? "Menghapus..." : "Ya, Hapus Sekarang"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
