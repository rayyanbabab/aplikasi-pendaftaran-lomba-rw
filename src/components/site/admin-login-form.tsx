"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { adminSignIn } from "@/actions/auth";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Logo81 } from "@/components/site/logo-81";
import { adminSignInSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

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
  const { resolvedTheme } = useTheme();
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNote, setShowNote] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isHover, setIsHover] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

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
    <div
      className={cn(
        "relative flex min-h-screen transition-colors duration-200",
        isDark ? "bg-[#141414] text-white" : "bg-[#f8f6f6] text-[#1b0d0d]"
      )}
    >
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-primary lg:flex">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            isDark ? "opacity-40" : "opacity-35"
          )}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop')",
          }}
        />
        <div
          className={cn(
            "absolute inset-0",
            isDark ? "bg-gradient-to-t from-primary/90 to-transparent" : "bg-[#ee2b2b]/60"
          )}
        />
        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ee2b2b] shadow-lg p-1 ring-1 ring-white/30 overflow-hidden">
              <Logo81 className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight block leading-tight">Semarak 17-an</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300 block">
                RW 10 &middot; Agustusan 2026
              </span>
            </div>
          </div>

          <div className="max-w-md space-y-4 my-auto py-12">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              Pusat Kendali Semarak Kemerdekaan.
            </h1>
            <p className="text-base sm:text-lg font-normal leading-relaxed text-neutral-200">
              Sistem pendataan terpadu untuk pencatatan peserta lomba, pengelolaan jadwal, serta pendataan pemenang lomba bagi seluruh warga RW 10.
            </p>
          </div>

          <div className="text-xs font-medium tracking-wide text-white/75">
            &copy; 2026 HUTRI-81. Dirgahayu Indonesia
          </div>
        </div>
      </div>

      {/* Right Column: Clean Authentication Form */}
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center p-6 sm:p-10 lg:w-1/2",
          isDark ? "bg-[#141414]" : "bg-[#f8f6f6]"
        )}
      >
        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
          <div className="flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary transition-all duration-200 hover:-translate-x-1.5 hover:opacity-80 w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="space-y-2">
            <h2
              className={cn(
                "text-3xl font-black leading-tight tracking-tight",
                isDark ? "text-white" : "text-[#1b0d0d]"
              )}
            >
              Masuk Ke Sistem
            </h2>
            <p className={cn("text-sm sm:text-base font-normal leading-relaxed", isDark ? "text-neutral-400" : "text-neutral-600")}>
              Silakan masukkan username atau email panitia Anda untuk memulai pengelolaan data pendaftaran.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label
                className={cn("text-sm font-bold tracking-tight", isDark ? "text-neutral-200" : "text-[#1b0d0d]")}
              >
                Username atau Email Akun
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Contoh: wahyu atau panitia@gmail.com"
                  className={cn(
                    "h-14 w-full rounded-xl border p-4 pr-12 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                    isDark
                      ? "border-neutral-800 bg-neutral-900/80 text-white placeholder:text-neutral-600"
                      : "border-neutral-300 bg-white text-[#1b0d0d] placeholder:text-neutral-400"
                  )}
                  {...form.register("email")}
                />
                <div className="absolute right-4 z-20 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowNote((v) => !v)}
                    onMouseEnter={() => setShowNote(true)}
                    onMouseLeave={() => setShowNote(false)}
                    className="text-neutral-400 transition-colors hover:text-primary active:scale-95 p-0.5"
                    aria-label="Catatan Login Panitia"
                  >
                    <AlertCircle className="h-5 w-5" />
                  </button>

                  {showNote && (
                    <div className="animate-fade-in absolute bottom-full -right-2 mb-2.5 w-64 sm:w-72 rounded-xl border border-primary/30 bg-[#121212]/95 p-3 text-xs text-white shadow-2xl backdrop-blur-md z-50 pointer-events-none">
                      <p className="font-extrabold text-[#ee2b2b] mb-1 uppercase tracking-widest text-[10px]">Catatan Penting</p>
                      <p className="leading-relaxed text-neutral-200">
                        Panitia dapat langsung menggunakan <span className="font-bold text-white underline">username</span> tanpa domain email (contoh: <span className="font-bold text-[#ee2b2b]">wahyu</span>).
                      </p>
                      {/* Triangle arrow pointer */}
                      <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-[#121212]/95" />
                    </div>
                  )}
                </div>
              </div>
              {form.formState.errors.email && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className={cn("text-sm font-bold tracking-tight", isDark ? "text-neutral-200" : "text-[#1b0d0d]")}
              >
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "h-14 w-full rounded-xl border p-4 pr-12 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                    isDark
                      ? "border-neutral-800 bg-neutral-900/80 text-white placeholder:text-neutral-600"
                      : "border-neutral-300 bg-white text-[#1b0d0d] placeholder:text-neutral-400"
                  )}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 text-neutral-400 transition-colors hover:text-primary"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => {
                setIsHover(false);
                setIsActive(false);
              }}
              onMouseDown={() => setIsActive(true)}
              onMouseUp={() => setIsActive(false)}
              className={cn(
                "h-14 w-full rounded-xl text-base font-extrabold tracking-wide shadow-lg transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
                isActive
                  ? "bg-[#b91c1c] text-white"
                  : isHover
                    ? "bg-[#d92020] text-white shadow-primary/30 shadow-xl"
                    : "bg-[#ee2b2b] text-white"
              )}
            >
              {isPending ? "Memeriksa Kredensial..." : "Masuk Dashboard"}
            </button>
          </form>

          <div
            className={cn(
              "border-t pt-6 text-center text-sm font-medium",
              isDark ? "border-neutral-800 text-neutral-400" : "border-neutral-200 text-neutral-600"
            )}
          >
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
