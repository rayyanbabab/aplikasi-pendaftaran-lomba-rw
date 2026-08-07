"use client";

import * as React from "react";
import { toast } from "sonner";
import { 
  QrCode, 
  CheckCircle2, 
  RefreshCw, 
  Phone, 
  Award, 
  Users
} from "lucide-react";

import { checkInRegistration } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CheckinResult = {
  publicCode: string;
  status: string;
  contactName: string;
  contactPhone: string;
  competitionName: string;
  categoryName: string;
  participants: Array<{ fullName: string; role: string }>;
};

export function AdminCheckin() {
  const [code, setCode] = React.useState("");
  const [result, setResult] = React.useState<CheckinResult | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;

    startTransition(async () => {
      const response = await checkInRegistration({ publicCode: code.trim().toUpperCase() });
      if (!response.ok) {
        toast.error(response.error || "Kode tiket tidak valid atau pendaftaran telah dibatalkan.");
        setResult(null);
        return;
      }
      toast.success("Check-in berhasil merekam kehadiran peserta!");
      setResult(response.data ?? null);
    });
  };

  const handleNextScan = () => {
    setResult(null);
    setCode("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* HEADER: Direct and functional */}
      <section className="border-b border-border pb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Pos Check-in Lapangan
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pindai barcode pada E-Tiket warga atau masukkan kode pendaftaran secara manual di meja registrasi.
          </p>
        </div>
        <div className="hidden sm:block text-right shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Terminal Aktif
          </span>
        </div>
      </section>

      {/* TERMINAL INPUT BOOTH: Clean, robust, accessible */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <QrCode className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Masukkan atau Scan Kode Tiket</span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              ref={inputRef}
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="HUT-81-XXXX"
              className="h-16 w-full rounded-xl border-2 border-border bg-background px-6 text-center font-mono text-2xl sm:text-3xl font-bold tracking-[0.2em] text-foreground uppercase focus:border-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !code.trim()}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] font-bold text-sm text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818] transition-all duration-200 active:scale-[0.99]"
          >
            {isPending ? "Memeriksa Kode..." : "Verifikasi Kehadiran Sekarang"}
          </Button>
        </form>
      </div>

      {/* RESULT TICKET PASS */}
      {result && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border p-6 bg-muted/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-500 shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Tiket Sah & Warga Hadir</h2>
                <p className="text-xs text-muted-foreground">Kehadiran tercatat dalam sistem</p>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
              {result.publicCode}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-border bg-background p-4">
              <div>
                <span className="text-xs text-muted-foreground block">Cabang Lomba</span>
                <p className="font-bold text-base text-foreground mt-0.5">{result.competitionName}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Kategori Usia</span>
                <p className="font-semibold text-sm text-foreground mt-0.5">{result.categoryName}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-y border-border py-3 text-sm">
              <span className="text-muted-foreground">Penanggung Jawab: <span className="font-semibold text-foreground ml-1">{result.contactName}</span></span>
              <span className="font-mono font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {result.contactPhone}
              </span>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>Anggota Regu ({result.participants.length} Orang)</span>
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {result.participants.map((participant) => {
                  const isLeader = participant.role === "KETUA_TIM" || participant.role === "LEADER";
                  return (
                    <div
                      key={participant.fullName}
                      className="flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5"
                    >
                      <span className="font-semibold text-sm text-foreground">{participant.fullName}</span>
                      <span className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                        isLeader ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"
                      )}>
                        {participant.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button
                type="button"
                onClick={handleNextScan}
                className="h-11 w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-6 font-bold text-sm text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818] transition-all duration-200 active:scale-[0.98]"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Tiket Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
