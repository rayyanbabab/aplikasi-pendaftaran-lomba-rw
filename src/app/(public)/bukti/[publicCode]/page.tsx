import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import {
  ageCategories,
  competitions,
  events,
  participants as participantTable,
  registrations,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";

export default async function BuktiPage({
  params,
}: {
  params: { publicCode: string };
}) {
  const code = params.publicCode.toUpperCase();

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
    width: 240,
    margin: 1,
  });

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Bukti Pendaftaran</h1>
          <p className="text-muted-foreground">
            Simpan halaman ini untuk check-in.
          </p>
        </div>
        <Badge variant="secondary">{registration.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader>
            <CardTitle>Detail Pendaftaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Kode Pendaftaran</p>
                <p className="text-lg font-semibold text-primary">{registration.publicCode}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Jenis Pendaftaran</p>
                <p className="font-semibold">{registration.entryType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lomba</p>
                <p className="font-semibold">{registration.competitionName ?? "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kategori Umur</p>
                <p className="font-semibold">{registration.ageCategoryName ?? "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kontak</p>
                <p className="font-semibold">{registration.contactName}</p>
                <p className="text-muted-foreground">{registration.contactPhone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Event</p>
                <p className="font-semibold">{event?.name ?? "-"}</p>
                <p className="text-muted-foreground">{event?.location ?? "-"}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold">Daftar Peserta</p>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-white/80 px-3 py-2"
                  >
                    <span>{participant.fullName}</span>
                    <Badge variant="outline">{participant.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-sm text-muted-foreground">Scan saat check-in</p>
          <Image src={qrDataUrl} alt="QR Code" width={200} height={200} unoptimized />
          <p className="text-xs text-muted-foreground">/bukti/{registration.publicCode}</p>
        </Card>
      </div>
    </section>
  );
}
