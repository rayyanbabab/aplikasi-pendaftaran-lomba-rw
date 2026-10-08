"use client";

import * as React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  QrCode,
  Sparkles,
  Trash2,
  UserPlus,
} from "lucide-react";

import { submitRegistration } from "@/actions/registration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateAge } from "@/lib/age";
import { registrationSchema, type RegistrationInput } from "@/lib/validators";
import { cn } from "@/lib/utils";

const emptyParticipant = () => ({
  fullName: "",
  birthDate: "",
  role: "LEADER" as const,
});

type RegisterFormProps = {
  competition: {
    id: number;
    name: string;
    type: "SOLO" | "TEAM" | "BOTH";
    minMembers: number;
    maxMembers: number;
  };
  categories: Array<{ id: number; name: string; ageMin: number; ageMax: number }>;
  eventDate: string;
};

export function RegisterForm({ competition, categories, eventDate }: RegisterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const eventDateValue = eventDate ? new Date(eventDate) : null;

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      competitionId: String(competition.id),
      ageCategoryId: categories[0]?.id ? String(categories[0].id) : "",
      entryType: competition.type === "BOTH" ? "SOLO" : competition.type,
      contactName: "",
      contactPhone: "",
      participants: [emptyParticipant()],
      honeypot: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const entryType = form.watch("entryType");

  React.useEffect(() => {
    if (entryType === "SOLO") {
      if (fields.length !== 1) {
        replace([fields[0] ?? emptyParticipant()]);
      }
    } else {
      const minMembers = competition.minMembers;
      if (fields.length < minMembers) {
        const extras = Array.from({ length: minMembers - fields.length }, () => ({
          fullName: "",
          birthDate: "",
          role: "MEMBER" as const,
        }));
        replace([
          fields[0] ?? { fullName: "", birthDate: "", role: "LEADER" as const },
          ...fields.slice(1),
          ...extras,
        ]);
      }
    }
  }, [entryType, competition.minMembers, fields, replace]);

  const birthDate = useWatch({ control: form.control, name: "participants.0.birthDate" });

  const suggestedCategory = React.useMemo(() => {
    if (!eventDateValue) return null;
    if (!birthDate) return null;
    const parsed = new Date(birthDate);
    if (Number.isNaN(parsed.getTime())) return null;
    const age = calculateAge(parsed, eventDateValue);
    return categories.find(
      (category) => age >= category.ageMin && age <= category.ageMax,
    );
  }, [birthDate, categories, eventDateValue]);

  // Auto-pilih kategori umur saat tanggal lahir berubah
  React.useEffect(() => {
    if (suggestedCategory) {
      form.setValue("ageCategoryId", String(suggestedCategory.id));
    }
  }, [suggestedCategory, form]);

  const onSubmit = (values: RegistrationInput) => {
    startTransition(async () => {
      const result = await submitRegistration(values);
      if (!result.ok) {
        toast.error(result.error || "Gagal menyimpan pendaftaran. Periksa kembali form isian Anda.");
        return;
      }
      toast.success("Pendaftaran berhasil! Menerbitkan E-Ticket QR Anda...");
      router.push(`/bukti/${("publicCode" in result ? (result as { publicCode?: string }).publicCode : "")}`);
    });
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
      <CardHeader className="border-b border-border/60 bg-muted/20 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <QrCode className="h-3.5 w-3.5" />
            Pendaftaran Mandiri &middot; Tanpa Akun
          </span>
          <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
            RW 10 &bull; Agustusan 2026
          </span>
        </div>
        <CardTitle className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Formulir Pendaftaran Lomba
        </CardTitle>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Silakan isi formulir di bawah ini. E-Ticket resmi beserta QR Code check-in akan diterbitkan langsung untuk disimpan.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-7">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Pengaturan Lomba & Kategori */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
                1
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Kategori Pertandingan
              </h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Jenis Partisipasi</Label>
                <Select
                  value={entryType}
                  onValueChange={(value) => form.setValue("entryType", value as "SOLO" | "TEAM")}
                  disabled={competition.type !== "BOTH"}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border bg-background px-3.5 text-xs font-medium text-foreground">
                    <SelectValue placeholder="Pilih jenis partisipasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLO" className="text-xs font-medium">Perorangan / Solo</SelectItem>
                    <SelectItem value="TEAM" className="text-xs font-medium">Beregu / Tim</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  {competition.type === "BOTH"
                    ? "Lomba ini dapat diikuti perorangan maupun beregu."
                    : `Sistem pertandingan ${competition.type === "TEAM" ? "Beregu (Tim)" : "Perorangan (Solo)"}.`}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Kelompok Usia</Label>
                <Select
                  value={form.watch("ageCategoryId")}
                  onValueChange={(value) => form.setValue("ageCategoryId", value)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border bg-background px-3.5 text-xs font-medium text-foreground">
                    <SelectValue placeholder="Pilih kelompok usia" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)} className="text-xs font-medium">
                        {category.name} ({category.ageMin}&ndash;{category.ageMax} Thn)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {suggestedCategory ? (
                  <p className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Sesuai tanggal lahir: {suggestedCategory.name}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Kategori akan terdeteksi otomatis saat tanggal lahir diisi.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Data Kontak Penanggung Jawab */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Kontak Penanggung Jawab
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Nama Penanggung Jawab (PJ)</Label>
                <Input
                  className="h-11 rounded-xl bg-background text-xs font-medium px-3.5 text-foreground"
                  {...form.register("contactName")}
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">Nomor WhatsApp Aktif</Label>
                <div className="relative">
                  <Input
                    className="h-11 rounded-xl bg-background text-xs font-medium pl-3.5 pr-10 text-foreground"
                    {...form.register("contactPhone")}
                    placeholder="Contoh: 081234567890"
                    type="tel"
                  />
                  <PhoneCall className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Nomor WhatsApp digunakan panitia untuk konfirmasi jadwal dan mengirimkan E-Ticket QR Code.
            </p>
          </div>

          {/* Section 3: Data Peserta / Anggota */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
                  3
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {entryType === "TEAM" ? `Personil Regu (Maks. ${competition.maxMembers} Orang)` : "Data Peserta Lomba"}
                </h3>
              </div>
              
              {entryType === "TEAM" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-lg text-xs font-bold px-3 h-8"
                  onClick={() => {
                    if (fields.length < competition.maxMembers) {
                      append({ fullName: "", birthDate: "", role: "MEMBER" });
                    } else {
                      toast.warning(`Maksimal anggota untuk perlombaan ini adalah ${competition.maxMembers} orang.`);
                    }
                  }}
                >
                  <UserPlus className="mr-1 h-3.5 w-3.5" />
                  Tambah Anggota
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "rounded-xl border p-4 sm:p-5 transition-all duration-200",
                    index === 0
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/80 bg-muted/20"
                  )}
                >
                  <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="text-[11px] font-bold text-foreground">
                      {index === 0 ? "Ketua Regu / Peserta Utama" : `Anggota Regu #${index + 1}`}
                    </span>
                    {entryType === "TEAM" && index > 0 && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Nama Lengkap</Label>
                      <Input
                        className="h-10 rounded-lg bg-background px-3 text-xs font-medium text-foreground"
                        {...form.register(`participants.${index}.fullName`)}
                        placeholder="Nama sesuai KTP / KK"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Tanggal Lahir</Label>
                      <Input
                        className="h-10 rounded-lg bg-background px-3 text-xs font-medium text-foreground"
                        type="date"
                        {...form.register(`participants.${index}.birthDate`)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            {...form.register("honeypot")}
          />

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 border-t border-border/60 sm:flex-row sm:justify-end">
            <Button
              asChild
              type="button"
              variant="outline"
              className="rounded-xl border-border/80 font-semibold text-xs h-11 px-5"
            >
              <Link href="/daftar">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Batal
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary text-primary-foreground font-bold text-xs h-11 px-6 shadow-xs hover:bg-primary/90 cursor-pointer"
            >
              {isPending ? "Sedang Menerbitkan Tiket..." : "Kirim & Dapatkan E-Ticket QR"}
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
