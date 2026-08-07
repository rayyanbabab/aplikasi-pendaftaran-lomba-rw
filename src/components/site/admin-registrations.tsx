"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  XCircle, 
  ArrowUpRight
} from "lucide-react";

import { updateRegistrationStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "SUBMITTED", label: "Menunggu", icon: Clock, className: "text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10" },
  { value: "VERIFIED", label: "Terverifikasi (Sah)", icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
  { value: "CHECKED_IN", label: "Check-in Lapangan", icon: QrCode, className: "text-blue-600 dark:text-blue-400 border-blue-500/40 bg-blue-500/10" },
  { value: "CANCELLED", label: "Dibatalkan", icon: XCircle, className: "text-zinc-600 dark:text-zinc-400 border-zinc-500/40 bg-zinc-500/10" },
] as const;

type RegistrationRow = {
  id: number;
  publicCode: string;
  contactName: string;
  contactPhone: string;
  status: string;
  entryType: string;
  createdAt: string;
  competitionName: string;
  categoryName: string;
};

type CompetitionOption = { id: number; name: string };
type CategoryOption = { id: number; competitionId: number; name: string };

export function AdminRegistrations({
  registrations,
  competitions,
  categories,
  filters,
  exportUrl,
}: {
  registrations: RegistrationRow[];
  competitions: CompetitionOption[];
  categories: CategoryOption[];
  filters: {
    q: string;
    competitionId?: number;
    ageCategoryId?: number;
    status?: string;
  };
  exportUrl: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [search, setSearch] = React.useState(filters.q ?? "");
  const [competitionId, setCompetitionId] = React.useState(
    filters.competitionId ? String(filters.competitionId) : "all",
  );
  const [categoryId, setCategoryId] = React.useState(
    filters.ageCategoryId ? String(filters.ageCategoryId) : "all",
  );
  const [status, setStatus] = React.useState(filters.status ?? "all");

  const filteredCategories = competitionId !== "all"
    ? categories.filter((category) => String(category.competitionId) === competitionId)
    : categories;

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (competitionId !== "all") params.set("competitionId", competitionId);
    if (categoryId !== "all") params.set("ageCategoryId", categoryId);
    if (status !== "all") params.set("status", status);
    router.push(`/portal/pendaftaran?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearch("");
    setCompetitionId("all");
    setCategoryId("all");
    setStatus("all");
    router.push("/portal/pendaftaran");
  };

  const updateStatus = (registrationId: number, nextStatus: string) => {
    startTransition(async () => {
      const result = await updateRegistrationStatus({
        registrationId,
        status: nextStatus,
      });
      if (!result.ok) {
        toast.error(result.error || "Gagal memperbarui status.");
        return;
      }
      toast.success("Status verifikasi diperbarui.");
      router.refresh();
    });
  };

  const handleQuickStatus = (s: string) => {
    setStatus(s);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (competitionId !== "all") params.set("competitionId", competitionId);
    if (categoryId !== "all") params.set("ageCategoryId", categoryId);
    if (s !== "all") params.set("status", s);
    router.push(`/portal/pendaftaran?${params.toString()}`);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* HEADER: Direct, clear, anti-slop */}
      <section className="flex flex-col justify-between gap-6 border-b border-border pb-7 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Verifikasi Pendaftaran Warga
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Periksa berkas calon peserta lomba dan sahkan kehadiran untuk diikat dengan E-Tiket pemindaian arena.
          </p>
        </div>
        
        <Button asChild className="h-11 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-5 font-bold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:from-[#e01d1d] hover:to-[#c91818] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] shrink-0">
          <Link href={exportUrl} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Ekspor Rekap CSV</span>
          </Link>
        </Button>
      </section>

      {/* FILTER CONTROLS */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Filter Status:</span>
            <button
              type="button"
              onClick={() => handleQuickStatus("all")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                status === "all"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Semua ({status === "all" ? registrations.length : "&bull;"})
            </button>
            {statusOptions.map((opt) => {
              const isSelected = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleQuickStatus(opt.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border",
                    isSelected
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:text-foreground"
                  )}
                >
                  {opt.label.split(" ")[0]}
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground w-fit"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Reset Filter
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-12 items-center">
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama perwakilan, telepon, atau kode tiket..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 rounded-xl bg-background pl-10 pr-4 text-sm border-border"
            />
          </div>

          <div className="sm:col-span-3">
            <Select value={competitionId} onValueChange={(value) => setCompetitionId(value)}>
              <SelectTrigger className="h-10 rounded-xl bg-background text-sm border-border">
                <SelectValue placeholder="Semua Cabang Lomba" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="all" className="text-sm">Semua Lomba</SelectItem>
                {competitions.map((competition) => (
                  <SelectItem key={competition.id} value={String(competition.id)} className="text-sm">
                    {competition.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Select value={categoryId} onValueChange={(value) => setCategoryId(value)}>
              <SelectTrigger className="h-10 rounded-xl bg-background text-sm border-border">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="all" className="text-sm">Semua Kategori</SelectItem>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)} className="text-sm">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Button
              type="button"
              onClick={applyFilters}
              disabled={isPending}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] text-sm font-bold text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818] transition-all"
            >
              {isPending ? "Mencari..." : "Terapkan"}
            </Button>
          </div>
        </div>
      </div>

      {/* SPREADSHEET TABLE: Anti-slop engineering */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">
            Daftar Pendaftaran <span className="text-muted-foreground font-normal ml-1">({registrations.length} data)</span>
          </span>
          <span className="text-xs text-muted-foreground">Klik kode tiket untuk meninjau bukti pendaftaran</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-6 py-3.5">Kode Tiket</th>
                <th className="px-6 py-3.5">Penanggung Jawab</th>
                <th className="px-6 py-3.5">Cabang & Kategori</th>
                <th className="px-6 py-3.5">Tipe</th>
                <th className="px-6 py-3.5 text-right">Status Keabsahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-sm font-medium text-muted-foreground">
                    Tidak ada data pendaftaran warga yang sesuai kriteria pencarian saat ini.
                  </td>
                </tr>
              ) : (
                registrations.map((row) => {
                  const currentStatusOpt = statusOptions.find((s) => s.value === row.status);
                  const isSolo = row.entryType === "SOLO";

                  return (
                    <tr key={row.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                        <Link
                          href={`/bukti/${row.publicCode}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 font-bold text-foreground hover:underline"
                          title="Buka tiket di tab baru"
                        >
                          <span>{row.publicCode}</span>
                          <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{row.contactName}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {row.contactPhone}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{row.competitionName}</p>
                        <span className="inline-block text-xs text-muted-foreground mt-0.5">
                          {row.categoryName}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold",
                          isSolo ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                        )}>
                          {row.entryType}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end">
                          <Select
                            value={row.status}
                            onValueChange={(value) => updateStatus(row.id, value)}
                            disabled={isPending}
                          >
                            <SelectTrigger className={cn(
                              "h-9 w-[165px] text-xs font-bold rounded-xl border transition-all",
                              currentStatusOpt?.className
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border">
                              {statusOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                  <SelectItem key={option.value} value={option.value} className="text-xs font-semibold py-2">
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                      <span>{option.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
