"use client";

import * as React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Sparkles, UserPlus, Trash2, PhoneCall, QrCode } from "lucide-react";

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
        toast.error(result.error || "Gagal menyimpan pendaftaran. Periksa kembali jaringan Anda.");
        return;
      }
      toast.success("Pendaftaran berhasil! Mengarahkan menuju bukti tiket QR digital...");
      router.push(`/bukti/${("publicCode" in result ? (result as { publicCode?: string }).publicCode : "")}`);
    });
  };

  return (
    <Card className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg dark:bg-card/95">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-7 pt-8 px-6 sm:px-8 dark:bg-muted/10">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            <QrCode className="h-3.5 w-3.5" />
            Registrasi Digital &middot; Tanpa Akun
          </span>
          <span className="text-[11px] font-extrabold text-muted-foreground tracking-widest uppercase">
            HUT RI KE-81 &bull; RW 10
          </span>
        </div>
        <CardTitle className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Formulir Pendaftaran Resmi
        </CardTitle>
        <p className="mt-1.5 text-sm font-normal text-foreground/80 leading-relaxed">
          Lengkapi data singkat di bawah ini. <strong className="text-foreground font-semibold">E-Ticket dan QR Code check-in</strong> akan langsung diterbitkan secara otomatis setelah formulir dikirim.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9">
          
          {/* Section 1: Pengaturan Lomba & Kategori */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ee2b2b] text-white text-xs font-bold shadow-xs">1</span>
              Jalur &amp; Kategori Kompetisi
            </h3>
            
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Jenis Partisipasi</Label>
                <Select
                  value={entryType}
                  onValueChange={(value) => form.setValue("entryType", value as "SOLO" | "TEAM")}
                  disabled={competition.type !== "BOTH"}
                >
                  <SelectTrigger className="h-13 rounded-2xl border-border bg-background px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih jenis partisipasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLO" className="font-medium">Individu / Solo (Perorangan)</SelectItem>
                    <SelectItem value="TEAM" className="font-medium">Beregu / Tim (Kelompok)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-foreground/75">
                  {competition.type === "BOTH"
                    ? "Lomba ini membuka jalur partisipasi individu maupun regu."
                    : `Dikhususkan untuk pendaftaran kompetisi sistem ${competition.type === "TEAM" ? "Beregu (Tim)" : "Perorangan (Solo)"}.`}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Kelompok Usia Peserta</Label>
                <Select
                  value={form.watch("ageCategoryId")}
                  onValueChange={(value) => form.setValue("ageCategoryId", value)}
                >
                  <SelectTrigger className="h-13 rounded-2xl border-border bg-background px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih kelompok usia" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)} className="font-medium">
                        {category.name} ({category.ageMin}&ndash;{category.ageMax} Thn)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {suggestedCategory ? (
                  <p className="animate-fade-in inline-flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Dipilih otomatis: <span className="underline">{suggestedCategory.name}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-foreground/75">Isi tanggal lahir peserta agar kategori usia terisi otomatis.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Data Kontak Penanggung Jawab */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ee2b2b] text-white text-xs font-bold shadow-xs">2</span>
              Kontak Penanggung Jawab (PJ / Koordinator)
            </h3>
            <div className="grid gap-5 md:grid-cols-2 pt-1">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Nama Penanggung Jawab</Label>
                <Input
                  className="h-13 rounded-2xl bg-background text-sm font-medium px-4 text-foreground transition-colors duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  {...form.register("contactName")}
                  placeholder="Nama lengkap aktif"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Nomor WhatsApp Aktif</Label>
                <div className="relative">
                  <Input
                    className="h-13 rounded-2xl bg-background text-sm font-medium pl-4 pr-11 text-foreground transition-colors duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...form.register("contactPhone")}
                    placeholder="Contoh: 081234567890"
                    type="tel"
                  />
                  <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            <p className="text-xs text-foreground/80 font-medium pt-0.5">
              *Nomor WhatsApp ini digunakan untuk menerima E-Ticket bukti pendaftaran dan pengingat jadwal dari panitia RW 10.
            </p>
          </div>

          {/* Section 3: Data Daftar Peserta / Anggota */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ee2b2b] text-white text-xs font-bold shadow-xs">3</span>
                {entryType === "TEAM" ? `Daftar Personil Tim (Maks. ${competition.maxMembers} Orang)` : "Data Identitas Peserta"}
              </h3>
              
              {entryType === "TEAM" && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="rounded-full font-bold text-xs border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 transition-all"
                  onClick={() => {
                    if (fields.length < competition.maxMembers) {
                      append({ fullName: "", birthDate: "", role: "MEMBER" });
                    } else {
                      toast.warning(`Maksimal anggota untuk perlombaan ini adalah ${competition.maxMembers} orang.`);
                    }
                  }}
                >
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Tambah Anggota
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "animate-fade-in-up rounded-3xl border p-5 sm:p-6 transition-all duration-200",
                    index === 0
                      ? "border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-xs dark:from-primary/15"
                      : "border-border/80 bg-muted/20 dark:bg-muted/10"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3.5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-foreground shadow-xs">
                      {index === 0 ? "👑 Ketua Tim / Peserta Utama" : `👤 Anggota Regu #${index + 1}`}
                    </span>
                    {entryType === "TEAM" && index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-red-500 hover:bg-red-500/10 hover:text-red-600 px-3 h-8 text-xs font-bold transition-colors"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Hapus
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Nama Lengkap</Label>
                      <Input
                        className="h-13 rounded-2xl bg-background px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        {...form.register(`participants.${index}.fullName`)}
                        placeholder="Nama sesuai KTP atau Kartu Keluarga"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Tanggal Lahir</Label>
                      <Input
                        className="h-13 rounded-2xl bg-background px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          <div className="flex flex-col-reverse gap-4 pt-6 border-t border-border/60 sm:flex-row sm:justify-end">
            <Button
              asChild
              type="button"
              variant="outline"
              size="lg"
              className="h-14 rounded-full border-border/80 bg-card px-8 font-bold text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              <Link href="/daftar">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Batal &amp; Kembali
              </Link>
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="h-14 w-full rounded-full bg-[#ee2b2b] px-10 text-base font-bold text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:bg-[#d42222] active:scale-[0.99] sm:flex-1"
            >
              {isPending ? "Sedang Menerbitkan Tiket QR..." : "Terbitkan E-Ticket QR Sekarang"}
              <CheckCircle2 className="ml-2.5 h-5 w-5" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
