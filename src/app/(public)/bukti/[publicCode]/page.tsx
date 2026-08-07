import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { eq } from "drizzle-orm";
import { CheckCircle2, MapPin, Calendar, User, Phone, Trophy, ArrowLeft } from "lucide-react";

import { db } from "@/db";
import { ageCategories, competitions, events, participants as participantTable, registrations } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { ETicketDownloadButton } from "@/components/site/eticket-download-button";

export default async function BuktiPage({
  params,
}: {
  params: { publicCode: string };
}) {
  const code = (await params).publicCode.toUpperCase();

  const [registration] = await db
    .select({
      id: registrations.id,
      publicCode: registrations.publicCode,
      status: registrations.status,
      contactName: registrations.contactName,
      contactPhone: registrations.contactPhone,
      entryType: registrations.entryType,
      competitionName: competitions.name,
      ageCategoryName: ageCategories.name,
      eventId: competitions.eventId,
    })
    .from(registrations)
    .leftJoin(competitions, eq(registrations.competitionId, competitions.id))
    .leftJoin(ageCategories, eq(registrations.ageCategoryId, ageCategories.id))
    .where(eq(registrations.publicCode, code))
    .limit(1);

  if (!registration) {
    notFound();
  }

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, registration.eventId ?? 0))
    .limit(1);

  const participants = await db
    .select()
    .from(participantTable)
    .where(eq(participantTable.registrationId, registration.id));

  const qrDataUrl = await QRCode.toDataURL(registration.publicCode, {
    width: 280,
    margin: 2,
    color: { dark: "#1a0a0a", light: "#ffffff" },
  });

  const eventDateStr = event?.eventDate
    ? new Date(event.eventDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "17 Agustus 2026";

  const isCheckedIn = registration.status === "CHECKED_IN";

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">

        {/* Back link */}
        <Link
          href="/daftar"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:-translate-x-1 hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Lomba
        </Link>

        {/* ═══════════════════════════════════════ */}
        {/* E-TICKET CARD (ini yang di-capture) */}
        {/* ═══════════════════════════════════════ */}
        <div
          id="eticket-card"
          className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-black/10"
        >
          {/* Header merah */}
          <div className="relative bg-gradient-to-br from-[#ee2b2b] to-[#c01f1f] px-6 py-7 text-white overflow-hidden">
            {/* Dekorasi lingkaran */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-6 left-12 h-24 w-24 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-red-200">
                  HUT RI KE-81 · RW 10 · AGUSTUSAN 2026
                </p>
                <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                  E-Ticket Resmi
                </h1>
                <p className="mt-1 text-sm font-medium text-red-100">
                  Semarak 17-an Warga RW 10
                </p>
              </div>
              <div className="shrink-0 rounded-2xl bg-white/15 p-2 backdrop-blur-sm ring-1 ring-white/20">
                <Trophy className="h-8 w-8 text-yellow-300" />
              </div>
            </div>

            {/* Status badge */}
            <div className="mt-5 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  isCheckedIn
                    ? "bg-green-400/20 text-green-200 ring-1 ring-green-300/30"
                    : "bg-white/15 text-white ring-1 ring-white/20"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isCheckedIn ? "Sudah Check-In" : "Terdaftar · Menunggu Check-In"}
              </span>
            </div>
          </div>

          {/* Kode unik strip */}
          <div className="flex items-center justify-between border-b border-dashed border-border/60 bg-muted/30 px-6 py-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Kode Pendaftaran
            </span>
            <span className="text-lg font-black tracking-widest text-primary">
              {registration.publicCode}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-[1fr_auto]">

              {/* Kiri: Detail info */}
              <div className="space-y-5">
                <InfoRow
                  icon={<Trophy className="h-4 w-4 text-primary" />}
                  label="Cabang Lomba"
                  value={registration.competitionName ?? "-"}
                />
                <InfoRow
                  icon={<User className="h-4 w-4 text-primary" />}
                  label="Kelompok Usia"
                  value={registration.ageCategoryName ?? "-"}
                />
                <InfoRow
                  icon={<User className="h-4 w-4 text-primary" />}
                  label="Jenis Partisipasi"
                  value={registration.entryType === "SOLO" ? "Individu / Perorangan" : "Beregu / Tim"}
                />
                <InfoRow
                  icon={<User className="h-4 w-4 text-primary" />}
                  label="Nama PJ / Kontak"
                  value={registration.contactName}
                />
                <InfoRow
                  icon={<Phone className="h-4 w-4 text-primary" />}
                  label="Nomor WhatsApp"
                  value={registration.contactPhone}
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4 text-primary" />}
                  label="Tanggal Acara"
                  value={eventDateStr}
                />
                <InfoRow
                  icon={<MapPin className="h-4 w-4 text-primary" />}
                  label="Lokasi"
                  value={event?.location ?? "Jl. Pengasinan Tengah, Depan Masjid Nurul Huda, RW 10"}
                />
              </div>

              {/* Kanan: QR Code */}
              <div className="flex flex-col items-center gap-3 sm:pl-4 sm:border-l sm:border-dashed sm:border-border/60">
                <div className="rounded-2xl border border-border/60 bg-white p-3 shadow-sm">
                  <Image
                    src={qrDataUrl}
                    alt={`QR Code ${registration.publicCode}`}
                    width={160}
                    height={160}
                    unoptimized
                  />
                </div>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Scan saat check-in
                </p>
              </div>
            </div>

            {/* Daftar peserta */}
            {participants.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Daftar Peserta ({participants.length} orang)
                </p>
                <div className="space-y-2">
                  {participants.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold">{p.fullName}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">
                        {p.role === "LEADER" ? "Ketua" : "Anggota"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer info */}
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <p className="text-xs font-semibold leading-relaxed text-foreground/70">
                📌 Tunjukkan E-Ticket ini kepada panitia saat check-in lomba. Kode QR akan dipindai untuk verifikasi. Pastikan kontak WhatsApp aktif untuk menerima pengingat jadwal.
              </p>
            </div>
          </div>

          {/* Watermark footer */}
          <div className="border-t border-dashed border-border/60 bg-muted/20 px-6 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Semarak 17-an RW 10 · HUT RI Ke-81 · 2026 · Dirgahayu Indonesia
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* Tombol Aksi (di luar card, tidak ikut didownload) */}
        {/* ═══════════════════════════════════════ */}
        <div className="mt-6 no-print">
          <ETicketDownloadButton
            ticketElementId="eticket-card"
            publicCode={registration.publicCode}
          />
          <p className="mt-4 text-center text-xs font-medium text-muted-foreground">
            Screenshot halaman ini atau unduh file PNG untuk menyimpan tiket secara offline.
          </p>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground leading-snug">{value}</p>
      </div>
    </div>
  );
}
