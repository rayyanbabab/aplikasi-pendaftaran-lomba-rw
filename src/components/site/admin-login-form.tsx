"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { adminSignIn } from "@/actions/auth";
import { Logo81 } from "@/components/site/logo-81";
import { adminSignInSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";

type AdminSignInInput = {
  email: string;
  password: string;
};

export function AdminLoginForm() {
  const router = useRouter();
  const form = useForm<AdminSignInInput>({
    resolver: zodResolver(adminSignInSchema),
    defaultValues: { email: "", password: "" },
  });
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNote, setShowNote] = React.useState(false);

  const onSubmit = (values: AdminSignInInput) => {
    startTransition(async () => {
      const result = await adminSignIn(values);
      if (!result.ok) {
        toast.error(result.error || "Login gagal. Periksa kembali kredensial Anda.");
        return;
      }
      toast.success("Selamat datang di Portal Panitia & Admin RW 10!");
      router.push("/portal");
    });
  };

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      {/* Left Column: Brand Hero Banner */}
      <div className="relative hidden w-1/2 overflow-hidden bg-primary lg:flex flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs shadow-xs p-1.5 ring-1 ring-white/25">
            <Logo81 className="h-full w-full object-contain brightness-0 invert" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight block leading-tight">Semarak 17-an</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 block">
              RW 10 &middot; Agustusan 2026
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-3 my-auto py-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            Portal Masuk Panitia
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
            Pusat Pengelolaan Kegiatan Kemerdekaan.
          </h1>
          <p className="text-sm font-normal leading-relaxed text-white/85">
            Sistem pendataan terpadu untuk pencatatan peserta lomba, verifikasi kehadiran QR Code, dan pengelolaan agenda perayaan HUT RI ke-81 RW 10.
          </p>
        </div>

        <div className="relative z-10 text-xs font-medium text-white/70">
          &copy; 2026 RW 10 Kelurahan Pengasinan &bull; Dirgahayu Republik Indonesia
        </div>
      </div>

      {/* Right Column: Clean Authentication Form */}
      <div className="flex w-full flex-col items-center justify-center p-6 sm:p-10 lg:w-1/2">
        <div className="w-full max-w-[380px] space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda
          </Link>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Masuk Portal Panitia
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Masukkan username atau email panitia Anda untuk mengakses sistem.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Username atau Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Contoh: panitia atau ketua@rw10.id"
                  className="h-11 w-full rounded-xl border border-border/80 bg-card px-3.5 pr-10 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  {...form.register("email")}
                />
                <div className="absolute right-3 z-20 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowNote((v) => !v)}
                    onMouseEnter={() => setShowNote(true)}
                    onMouseLeave={() => setShowNote(false)}
                    className="text-muted-foreground hover:text-primary p-0.5 cursor-pointer"
                    aria-label="Catatan Login Panitia"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </button>

                  {showNote && (
                    <div className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50">
                      <p className="font-bold text-primary mb-0.5 uppercase tracking-wider text-[10px]">
                        Petunjuk Login
                      </p>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Panitia dapat langsung masuk menggunakan <strong className="text-foreground">username</strong> tanpa domain @email.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {form.formState.errors.email && (
                <p className="text-[11px] font-semibold text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className="h-11 w-full rounded-xl border border-border/80 bg-card px-3.5 pr-10 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-[11px] font-semibold text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-all cursor-pointer mt-2"
            >
              {isPending ? "Memeriksa Kredensial..." : "Masuk ke Portal"}
            </Button>
          </form>

          <div className="border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
            Belum memiliki akun panitia?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
