"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  Trophy, 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  User, 
  Building2,
  X
} from "lucide-react";

import {
  createAgeCategory,
  createCompetition,
  deleteAgeCategory,
  deleteCompetition,
  updateAgeCategory,
  updateCompetition,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ageCategoryFormSchema,
  competitionFormSchema,
  type AgeCategoryFormInput,
  type CompetitionFormInput,
} from "@/lib/validators";
import { cn } from "@/lib/utils";

export type AdminCompetition = {
  id: number;
  eventId: number;
  name: string;
  type: "SOLO" | "TEAM" | "BOTH";
  quotaTotal: number | null;
  minMembers: number;
  maxMembers: number;
};

export type AdminCategory = {
  id: number;
  competitionId: number;
  name: string;
  ageMin: number;
  ageMax: number;
};

export type AdminEvent = {
  id: number;
  name: string;
  location: string;
};

export function AdminCompetitionManager({
  events,
  competitions,
  categories,
}: {
  events: AdminEvent[];
  competitions: AdminCompetition[];
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingCompetition, setEditingCompetition] = React.useState<AdminCompetition | null>(null);
  const [editingCategory, setEditingCategory] = React.useState<AdminCategory | null>(null);

  const createForm = useForm<CompetitionFormInput>({
    resolver: zodResolver(competitionFormSchema),
    defaultValues: {
      eventId: events[0]?.id ?? 1,
      name: "",
      type: "SOLO",
      quotaTotal: null,
      minMembers: 1,
      maxMembers: 1,
    },
  });

  const editForm = useForm<CompetitionFormInput>({
    resolver: zodResolver(competitionFormSchema),
    defaultValues: {
      eventId: events[0]?.id ?? 1,
      name: "",
      type: "SOLO",
      quotaTotal: null,
      minMembers: 1,
      maxMembers: 1,
    },
  });

  React.useEffect(() => {
    if (editingCompetition) {
      editForm.reset({
        eventId: editingCompetition.eventId,
        name: editingCompetition.name,
        type: editingCompetition.type,
        quotaTotal: editingCompetition.quotaTotal ?? null,
        minMembers: editingCompetition.minMembers,
        maxMembers: editingCompetition.maxMembers,
      });
    }
  }, [editingCompetition, editForm]);

  const editCategoryForm = useForm<AgeCategoryFormInput>({
    resolver: zodResolver(ageCategoryFormSchema),
    defaultValues: {
      competitionId: competitions[0]?.id ?? 1,
      name: "",
      ageMin: 7,
      ageMax: 12,
    },
  });

  React.useEffect(() => {
    if (editingCategory) {
      editCategoryForm.reset({
        competitionId: editingCategory.competitionId,
        name: editingCategory.name,
        ageMin: editingCategory.ageMin,
        ageMax: editingCategory.ageMax,
      });
    }
  }, [editingCategory, editCategoryForm]);

  const handleCreateCompetition = (values: CompetitionFormInput) => {
    startTransition(async () => {
      const result = await createCompetition(values);
      if (!result.ok) {
        toast.error(result.error || "Gagal membuat lomba.");
        return;
      }
      toast.success("Perlombaan berhasil ditambahkan.");
      createForm.reset();
      setIsCreateOpen(false);
      router.refresh();
    });
  };

  const handleUpdateCompetition = (values: CompetitionFormInput) => {
    if (!editingCompetition) return;
    startTransition(async () => {
      const result = await updateCompetition(editingCompetition.id, values);
      if (!result.ok) {
        toast.error(result.error || "Gagal memperbarui lomba.");
        return;
      }
      toast.success("Data perlombaan berhasil diperbarui.");
      setEditingCompetition(null);
      router.refresh();
    });
  };

  const handleDeleteCompetition = (competitionId: number, compName: string) => {
    if (!window.confirm(`Hapus cabang "${compName}" beserta seluruh datanya?`)) return;
    startTransition(async () => {
      const result = await deleteCompetition(competitionId);
      if (!result.ok) {
        toast.error(result.error || "Gagal menghapus lomba.");
        return;
      }
      toast.success(`Cabang "${compName}" dihapus.`);
      router.refresh();
    });
  };

  const handleUpdateCategory = (values: AgeCategoryFormInput) => {
    if (!editingCategory) return;
    startTransition(async () => {
      const result = await updateAgeCategory(editingCategory.id, values);
      if (!result.ok) {
        toast.error(result.error || "Gagal memperbarui kategori.");
        return;
      }
      toast.success("Kategori usia diperbarui.");
      setEditingCategory(null);
      router.refresh();
    });
  };

  const handleDeleteCategory = (categoryId: number, catName: string) => {
    if (!window.confirm(`Hapus kategori "${catName}"?`)) return;
    startTransition(async () => {
      const result = await deleteAgeCategory(categoryId);
      if (!result.ok) {
        toast.error(result.error || "Gagal menghapus kategori.");
        return;
      }
      toast.success(`Kategori "${catName}" dihapus.`);
      router.refresh();
    });
  };

  const categoriesByCompetition = categories.reduce<Record<number, AdminCategory[]>>(
    (acc, category) => {
      acc[category.competitionId] = acc[category.competitionId] ?? [];
      acc[category.competitionId].push(category);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-12 pb-14">
      {/* HEADER: Structural & simple */}
      <section className="flex flex-col justify-between gap-6 border-b border-border pb-7 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Daftar & Syarat Perlombaan
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Kelola cabang pertandingan yang dibuka untuk warga, kuota peserta, dan pembagian rentang kelompok umur.
          </p>
        </div>

        <Button 
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-11 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-5 font-bold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:from-[#e01d1d] hover:to-[#c91818] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Buka Lomba Baru
        </Button>
      </section>

      {/* CATALOG GRID: Solid borders, clean content */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Cabang Aktif ({competitions.length})
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((competition) => {
            const isSolo = competition.type === "SOLO";
            const isTeam = competition.type === "TEAM";
            const eventInfo = events.find(e => e.id === competition.eventId);

            return (
              <div key={competition.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        isSolo ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        isTeam ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {isSolo ? <User className="h-3 w-3 inline" /> : <Users className="h-3 w-3 inline" />}
                        <span>{competition.type}</span>
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-foreground">
                        {competition.name}
                      </h3>
                    </div>

                    <Trophy className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Batas Kuota</span>
                      <span className="font-semibold text-foreground mt-0.5 block">{competition.quotaTotal ?? "Tak Terbatas"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Ukuran Tim</span>
                      <span className="font-semibold text-foreground mt-0.5 block">{competition.minMembers} &ndash; {competition.maxMembers} Orang</span>
                    </div>
                  </div>

                  {eventInfo && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{eventInfo.name}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-6 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCompetition(competition)}
                    className="h-8 rounded-lg border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCompetition(competition.id, competition.name)}
                    className="h-8 rounded-lg px-3 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Hapus
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL EDIT LOMBA (PORTAL KE ROOT BODY SEPERTI EDIT USERS) */}
      {editingCompetition &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
            <div className="relative my-auto w-full max-w-lg shrink-0 transition-transform">
              <Card className="w-full border-2 border-border/80 bg-white dark:bg-[#171313] text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.7)] opacity-100 animate-scale-in overflow-hidden rounded-2xl">
                <CardHeader className="border-b border-border/60 bg-gray-50/90 dark:bg-[#201919] pb-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-xl font-black text-foreground">
                      <Pencil className="h-5 w-5 text-[#ee2b2b]" />
                      Edit Data Lomba
                    </CardTitle>
                    <button
                      type="button"
                      onClick={() => setEditingCompetition(null)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <CardDescription className="mt-1 font-medium">
                    Ubah konfigurasi dan batasan untuk <span className="font-bold text-primary">{editingCompetition?.name}</span>.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 bg-white dark:bg-[#171313]">
                  <form onSubmit={editForm.handleSubmit(handleUpdateCompetition)} className="space-y-4">
                    <input type="hidden" value={editingCompetition?.eventId ?? events[0]?.id ?? 1} {...editForm.register("eventId", { valueAsNumber: true })} />
                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-foreground">Nama Cabang Lomba</Label>
                      <Input {...editForm.register("name")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium transition-all focus:border-[#ee2b2b] focus:ring-2 focus:ring-red-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-foreground">Tipe Pertandingan</Label>
                      <Select
                        value={editForm.watch("type")}
                        onValueChange={(value) => editForm.setValue("type", value as "SOLO" | "TEAM" | "BOTH")}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium">
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border">
                          <SelectItem value="SOLO">SOLO (Perorangan)</SelectItem>
                          <SelectItem value="TEAM">TEAM (Kelompok / Regu)</SelectItem>
                          <SelectItem value="BOTH">BOTH (Campuran)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Kuota</Label>
                        <Input type="number" {...editForm.register("quotaTotal")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Min Anggota</Label>
                        <Input type="number" {...editForm.register("minMembers")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Max Anggota</Label>
                        <Input type="number" {...editForm.register("maxMembers")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingCompetition(null)} className="h-11 rounded-xl text-sm font-semibold">
                        Batal
                      </Button>
                      <Button type="submit" disabled={isPending} className="h-11 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-6 text-sm font-bold text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818]">
                        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>,
          document.body
        )}

      {/* KATEGORI UMUR: Anti-slop layout without forced decorative boxes */}
      <section className="space-y-6 pt-6 border-t border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Kelompok Usia Peserta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tentukan batasan umur yang diizinkan mendaftar untuk masing-masing cabang perlombaan.
          </p>
        </div>

        {competitions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm font-medium">
            Belum ada cabang lomba terserdia.
          </div>
        ) : (
          <Tabs defaultValue={String(competitions[0]?.id)} className="space-y-6">
            <TabsList className="flex flex-wrap h-auto p-1 rounded-xl bg-muted border border-border gap-1 w-fit">
              {competitions.map((competition) => (
                <TabsTrigger 
                  key={competition.id} 
                  value={String(competition.id)}
                  className="rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs text-muted-foreground hover:text-foreground"
                >
                  {competition.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {competitions.map((competition) => (
              <TabsContent key={competition.id} value={String(competition.id)}>
                <div className="grid gap-6 md:grid-cols-12">
                  {/* Form Tambah Kategori */}
                  <div className="md:col-span-5 rounded-2xl border border-border bg-card p-6 h-fit">
                    <h3 className="text-base font-bold text-foreground border-b border-border pb-3.5 mb-4">
                      Tambah Rentang Umur Baru
                    </h3>
                    <CategoryForm
                      competitionId={competition.id}
                      onCreated={() => router.refresh()}
                    />
                  </div>

                  {/* Daftar Kategori Aktif */}
                  <div className="md:col-span-7 rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="border-b border-border p-6 pb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-foreground">Kategori Terdaftar</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Warga harus berada dalam rentang usia ini untuk dapat mendaftar.</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      {(categoriesByCompetition[competition.id] ?? []).length === 0 ? (
                        <p className="py-8 text-center text-sm font-normal text-muted-foreground">
                          Belum ada aturan kelompok usia untuk lomba ini.
                        </p>
                      ) : (
                        (categoriesByCompetition[competition.id] ?? []).map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
                          >
                            <div>
                              <p className="font-bold text-sm text-foreground">{category.name}</p>
                              <span className="text-xs text-muted-foreground block mt-0.5">
                                Rentang usia: <span className="font-semibold text-foreground">{category.ageMin} &ndash; {category.ageMax} Tahun</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingCategory(category)}
                                className="h-8 rounded-lg border-border bg-card px-3 text-xs font-semibold hover:bg-muted"
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                className="h-8 rounded-lg px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </section>

      {/* MODAL EDIT KATEGORI (PORTAL KE ROOT BODY SEPERTI EDIT USERS) */}
      {editingCategory &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
            <div className="relative my-auto w-full max-w-lg shrink-0 transition-transform">
              <Card className="w-full border-2 border-border/80 bg-white dark:bg-[#171313] text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.7)] opacity-100 animate-scale-in overflow-hidden rounded-2xl">
                <CardHeader className="border-b border-border/60 bg-gray-50/90 dark:bg-[#201919] pb-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-xl font-black text-foreground">
                      <Pencil className="h-5 w-5 text-[#ee2b2b]" />
                      Edit Rentang Usia
                    </CardTitle>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <CardDescription className="mt-1 font-medium">
                    Sesuaikan batas umur minimum dan maksimum untuk pendaftaran warga.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 bg-white dark:bg-[#171313]">
                  <form onSubmit={editCategoryForm.handleSubmit(handleUpdateCategory)} className="space-y-4">
                    <input
                      type="hidden"
                      defaultValue={editingCategory?.competitionId ?? ""}
                      {...editCategoryForm.register("competitionId", { valueAsNumber: true })}
                    />
                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-foreground">Nama Kategori</Label>
                      <Input {...editCategoryForm.register("name")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium transition-all focus:border-[#ee2b2b] focus:ring-2 focus:ring-red-500/20" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Umur Min (Thn)</Label>
                        <Input type="number" {...editCategoryForm.register("ageMin")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Umur Max (Thn)</Label>
                        <Input type="number" {...editCategoryForm.register("ageMax")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditingCategory(null)} className="h-11 rounded-xl text-sm font-semibold">
                        Batal
                      </Button>
                      <Button type="submit" disabled={isPending} className="h-11 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-6 text-sm font-bold text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818]">
                        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL TAMBAH CABANG LOMBA (PORTAL KE ROOT BODY SEPERTI EDIT USERS) */}
      {isCreateOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
            <div className="relative my-auto w-full max-w-lg shrink-0 transition-transform">
              <Card className="w-full border-2 border-border/80 bg-white dark:bg-[#171313] text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.7)] opacity-100 animate-scale-in overflow-hidden rounded-2xl">
                <CardHeader className="border-b border-border/60 bg-gray-50/90 dark:bg-[#201919] pb-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-xl font-black text-foreground">
                      <Trophy className="h-5 w-5 text-[#ee2b2b]" />
                      Tambah Cabang Perlombaan
                    </CardTitle>
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <CardDescription className="mt-1 font-medium">
                    Daftarkan cabang pertandingan baru beserta persyaratan kuota dan anggotanya.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 bg-white dark:bg-[#171313]">
                  <form onSubmit={createForm.handleSubmit(handleCreateCompetition)} className="space-y-4">
                    <input type="hidden" value={events[0]?.id ?? 1} {...createForm.register("eventId", { valueAsNumber: true })} />
                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-foreground">Nama Cabang Lomba</Label>
                      <Input 
                        {...createForm.register("name")} 
                        placeholder="Contoh: Tenis Meja / Balap Karung" 
                        className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium transition-all focus:border-[#ee2b2b] focus:ring-2 focus:ring-red-500/20" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-foreground">Tipe Pertandingan</Label>
                      <Select
                        value={createForm.watch("type")}
                        onValueChange={(value) => createForm.setValue("type", value as "SOLO" | "TEAM" | "BOTH")}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium">
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border">
                          <SelectItem value="SOLO">SOLO (Perorangan)</SelectItem>
                          <SelectItem value="TEAM">TEAM (Kelompok / Regu)</SelectItem>
                          <SelectItem value="BOTH">BOTH (Perorangan atau Regu)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Kuota (Opsional)</Label>
                        <Input type="number" {...createForm.register("quotaTotal")} placeholder="Tak terbatas" className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Min Anggota</Label>
                        <Input type="number" {...createForm.register("minMembers")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-foreground">Max Anggota</Label>
                        <Input type="number" {...createForm.register("maxMembers")} className="h-11 rounded-xl bg-white dark:bg-[#201919] border-border text-sm font-medium" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="h-11 rounded-xl text-sm font-semibold">
                        Batal
                      </Button>
                      <Button type="submit" disabled={isPending} className="h-11 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-6 text-sm font-bold text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818]">
                        {isPending ? "Menyimpan..." : "Simpan Cabang Lomba"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function CategoryForm({
  competitionId,
  onCreated,
}: {
  competitionId: number;
  onCreated: () => void;
}) {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<AgeCategoryFormInput>({
    resolver: zodResolver(ageCategoryFormSchema),
    defaultValues: {
      competitionId,
      name: "",
      ageMin: 7,
      ageMax: 12,
    },
  });

  React.useEffect(() => {
    form.reset({
      competitionId,
      name: "",
      ageMin: form.getValues("ageMin") || 7,
      ageMax: form.getValues("ageMax") || 12,
    });
  }, [competitionId, form]);

  const onSubmit = (values: AgeCategoryFormInput) => {
    startTransition(async () => {
      const result = await createAgeCategory(values);
      if (!result.ok) {
        toast.error(result.error || "Gagal menambah kategori.");
        return;
      }
      toast.success("Kategori usia ditambahkan.");
      form.reset({
        competitionId,
        name: "",
        ageMin: values.ageMin,
        ageMax: values.ageMax,
      });
      onCreated();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input
        type="hidden"
        defaultValue={competitionId}
        {...form.register("competitionId", { valueAsNumber: true })}
      />
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">Nama Kategori</Label>
        <Input {...form.register("name")} placeholder="Contoh: Anak (7-12 Th)" className="h-10 rounded-xl bg-card border-border text-sm" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Min (Th)</Label>
          <Input type="number" {...form.register("ageMin")} className="h-10 rounded-xl bg-card border-border text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Max (Th)</Label>
          <Input type="number" {...form.register("ageMax")} className="h-10 rounded-xl bg-card border-border text-sm" />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="h-10 w-full rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] text-sm font-bold text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818]">
        {isPending ? "Menambahkan..." : "Simpan Kategori"}
      </Button>
    </form>
  );
}
