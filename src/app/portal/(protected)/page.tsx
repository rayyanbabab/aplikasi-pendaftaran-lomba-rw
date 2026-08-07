import { sql } from "drizzle-orm";
import Link from "next/link";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  ArrowUpRight, 
  MapPin, 
  Calendar
} from "lucide-react";

import { db } from "@/db";
import { registrations } from "@/db/schema";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Ringkasan Statistik & Operasional",
  description: "Rekapitulasi pendaftaran lomba dan verifikasi warga RW 10.",
};

export default async function AdminDashboard() {
  const [[counts], trendRows] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)`,
        submitted: sql<number>`count(*) filter (where ${registrations.status} = 'SUBMITTED')`,
        verified: sql<number>`count(*) filter (where ${registrations.status} = 'VERIFIED')`,
        checkedIn: sql<number>`count(*) filter (where ${registrations.status} = 'CHECKED_IN')`,
      })
      .from(registrations),
    db
      .select({
        day: sql<string>`date_trunc('day', ${registrations.createdAt})`,
        status: registrations.status,
        count: sql<number>`count(*)`,
      })
      .from(registrations)
      .where(sql`${registrations.createdAt} >= now() - interval '6 days'`)
      .groupBy(sql`date_trunc('day', ${registrations.createdAt})`, registrations.status)
      .orderBy(sql`date_trunc('day', ${registrations.createdAt})`),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  const statusOrder = ["SUBMITTED", "VERIFIED", "CHECKED_IN", "CANCELLED"] as const;
  const statusLabels: Record<(typeof statusOrder)[number], string> = {
    SUBMITTED: "Menunggu Verifikasi",
    VERIFIED: "Terverifikasi",
    CHECKED_IN: "Hadir Check-in",
    CANCELLED: "Dibatalkan",
  };
  
  const statusColors: Record<(typeof statusOrder)[number], string> = {
    SUBMITTED: "bg-amber-500",
    VERIFIED: "bg-emerald-600 dark:bg-emerald-500",
    CHECKED_IN: "bg-blue-600 dark:bg-blue-500",
    CANCELLED: "bg-zinc-400 dark:bg-zinc-600",
  };

  const countsByDay = new Map<string, Record<(typeof statusOrder)[number], number>>();
  for (const row of trendRows) {
    const raw = new Date(row.day as string | number | Date);
    raw.setHours(0, 0, 0, 0);
    const key = raw.toISOString().slice(0, 10);
    const current =
      countsByDay.get(key) ??
      statusOrder.reduce(
        (acc, status) => ({ ...acc, [status]: 0 }),
        {} as Record<(typeof statusOrder)[number], number>,
      );
    current[row.status as (typeof statusOrder)[number]] = Number(row.count);
    countsByDay.set(key, current);
  }

  const chartData = days.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const label = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    const values =
      countsByDay.get(key) ??
      statusOrder.reduce(
        (acc, status) => ({ ...acc, [status]: 0 }),
        {} as Record<(typeof statusOrder)[number], number>,
      );
    const total = statusOrder.reduce((sum, status) => sum + values[status], 0);
    return { label, values, total };
  });

  const maxTotal = Math.max(1, ...chartData.map((item) => item.total));
  const weekTotal = chartData.reduce((sum, item) => sum + item.total, 0);
  const avgDaily = Math.round(weekTotal / chartData.length);
  const peakDay = chartData.reduce((max, item) => (item.total > max.total ? item : max), chartData[0]);

  const totalCount = Number(counts?.total ?? 0);
  const waitingCount = Number(counts?.submitted ?? 0);
  const verifiedCount = Number(counts?.verified ?? 0);
  const checkedInCount = Number(counts?.checkedIn ?? 0);

  return (
    <div className="space-y-10 pb-12">
      {/* HEADER: Anti-Slop structure without gradient blobs or verbose marketing copy */}
      <section className="flex flex-col justify-between gap-6 border-b border-border pb-8 lg:flex-row lg:items-end">
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dasbor Panitia HUT RI ke-81
          </h1>
          <p className="text-sm text-muted-foreground leading-normal">
            Pantau arus pendaftaran, validasi berkas warga, dan rekap kehadiran hari pelaksanaan lomba di RW 10.
          </p>
          <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              Jl. Pengasinan Tengah RW 10
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
              17 Agustus 2026
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/portal/pendaftaran"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-5 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:from-[#e01d1d] hover:to-[#c91818] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] gap-2"
          >
            <span>Verifikasi Data Warga</span>
            {waitingCount > 0 && (
              <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-black text-[#ee2b2b] shadow-xs">
                {waitingCount} baru
              </span>
            )}
            <ArrowUpRight className="h-4 w-4 opacity-80" />
          </Link>

          <Link
            href="/portal/checkin"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted gap-2"
          >
            <span>Pos Check-in QR</span>
            <ArrowUpRight className="h-4 w-4 opacity-50" />
          </Link>
        </div>
      </section>

      {/* METRIC DIALS: Clean, functional numbers without unnecessary glow or repetitive badges */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">Total Pendaftar</span>
            <Users className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">{totalCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Seluruh formulir masuk</p>
        </div>

        <div className={cn(
          "rounded-2xl border bg-card p-6",
          waitingCount > 0 ? "border-amber-500/50 bg-amber-500/[0.02]" : "border-border"
        )}>
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">Menunggu Verifikasi</span>
            <Clock className={cn("h-4 w-4", waitingCount > 0 ? "text-amber-500" : "text-muted-foreground")} />
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">{waitingCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {waitingCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Perlu tinjauan panitia</span>
            ) : (
              "Semua berkas tuntas dipersiksa"
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">Terverifikasi (Sah)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">{verifiedCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Peserta berhak bertanding</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-semibold">Hadir Check-in</span>
            <QrCode className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums">{checkedInCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Tercatat di arena</p>
        </div>
      </section>

      {/* TREND CHART & QUICK ACTION GRID: No AI Slop boxes */}
      <section className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Aktivitas Pendaftaran 7 Hari Terakhir</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Distribusi formulir masuk harian berdasarkan status</p>
            </div>
            <span className="text-xs font-semibold text-foreground bg-muted px-3 py-1 rounded-lg w-fit">
              Total 7 Hari: <span className="font-bold">{weekTotal}</span>
            </span>
          </div>

          {/* Key statistical parameters */}
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-xl bg-muted/50 p-3.5 border border-border/60">
              <span className="text-xs text-muted-foreground block">Rata-rata Harian</span>
              <span className="text-lg font-bold text-foreground tabular-nums">{avgDaily} <span className="text-xs font-normal text-muted-foreground">orang/hari</span></span>
            </div>
            <div className="rounded-xl bg-muted/50 p-3.5 border border-border/60">
              <span className="text-xs text-muted-foreground block">Hari Teramai (Peak)</span>
              <span className="text-lg font-bold text-foreground tabular-nums">{peakDay.total} <span className="text-xs font-normal text-muted-foreground">({peakDay.label})</span></span>
            </div>
            <div className="rounded-xl bg-muted/50 p-3.5 border border-border/60">
              <span className="text-xs text-muted-foreground block">Rasio Keabsahan Data</span>
              <span className="text-lg font-bold text-foreground tabular-nums">{totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0}% <span className="text-xs font-normal text-muted-foreground">sah</span></span>
            </div>
          </div>

          {/* Clean architectural bar chart */}
          <div className="pt-2">
            <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
              {statusOrder.map((status) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={cn("h-2.5 w-2.5 rounded-sm", statusColors[status])} />
                  <span>{statusLabels[status]}</span>
                </div>
              ))}
            </div>

            <div className="relative h-48 pt-4 border-t border-dashed border-border/60">
              <div className="flex h-full items-end gap-3 sm:gap-8">
                {chartData.map((item) => (
                  <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2 group">
                    <span className="text-[11px] font-semibold text-muted-foreground tabular-nums group-hover:text-foreground">
                      {item.total}
                    </span>
                    <div className="flex w-full max-w-[32px] flex-1 flex-col justify-end overflow-hidden rounded-md bg-muted/50">
                      {statusOrder.map((status) => {
                        const value = item.values[status];
                        const height = (value / maxTotal) * 100;
                        if (height <= 0) return null;
                        return (
                          <div
                            key={`${item.label}-${status}`}
                            className={statusColors[status]}
                            style={{ height: `${height}%` }}
                            title={`${statusLabels[status]}: ${value}`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Column: Functional and straightforward */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
              Pintasan Menu Utama
            </h2>
            <div className="space-y-2.5">
              <Link
                href="/portal/lomba"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 transition-colors hover:bg-muted/60"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Daftar & Syarat Lomba</p>
                  <p className="text-xs text-muted-foreground">Kelola cabang & usia</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/portal/pendaftaran"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 transition-colors hover:bg-muted/60"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Verifikasi Pendaftaran</p>
                  <p className="text-xs text-muted-foreground">Tinjau & ubah status</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/portal/users"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 transition-colors hover:bg-muted/60"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Akun Panitia</p>
                  <p className="text-xs text-muted-foreground">Manajemen akses staf</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-5 text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-1">Catatan Verifikasi</p>
            Pastikan nama peserta dan kesesuaian kategori usia warga dicek sebelum mengklik status <span className="font-semibold text-foreground">Sah</span>. Bila ada kesalahan input dari warga, hubungi nomor kontak perwakilan yang tertera.
          </div>
        </div>
      </section>
    </div>
  );
}
