"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, UserPlus, ShieldCheck, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { z } from "zod";

import { signUpUser } from "@/actions/auth";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Logo81 } from "@/components/site/logo-81";
import { registerAccountSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type RegisterAccountInput = z.infer<typeof registerAccountSchema>;

export function RegisterAccountForm() {
  const router = useRouter();
  const form = useForm<RegisterAccountInput>({
    resolver: zodResolver(registerAccountSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { resolvedTheme } = useTheme();
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const onSubmit = (values: RegisterAccountInput) => {
    startTransition(async () => {
      const result = await signUpUser(values);
      if (!result.ok) {
        toast.error(result.error || "Pendaftaran gagal. Periksa kembali data Anda.");
        return;
      }
      toast.success("Akun berhasil dibuat! Selamat datang di Dasbor Panitia.");
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

      {/* Left Branding Column */}
      <div className="relative hidden w-1/2 overflow-hidden bg-primary lg:flex">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            isDark ? "opacity-40" : "opacity-35"
          )}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-eqURzXMCDofVV5BRZHSaVNULfF65g_dmipjoaWf_IsZF_sMvt6kOzstDsJBqXWnxDEiN5105G5acKfOs4RtuKKGqIjK2gslHUHISRa4bq99x_WkeQQFe-Chseb_BbyC6hx_C7b6twPIs5ZDJmNB_9Ivu2VSA_ps39ybiwiIWnzq0Nz1zs_Z95eQUS4htf2TrXk0FQxaEoKwSxdZxdJ1V3nlTaUDIAOIj4Q4dg7stLc6XIL0Ko0nhYPhartaiuX5nNNTTuyYwRW70')",
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
                RT 04 &middot; Agustusan 2026
              </span>
            </div>
          </div>

          <div className="max-w-md space-y-4 my-auto py-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <UserPlus className="h-4 w-4 text-yellow-300" />
              Pendaftaran Panitia Baru
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              Bergabung Menjadi Panitia Lomba.
            </h1>
            <p className="text-base sm:text-lg font-normal leading-relaxed text-neutral-200">
              Buat akun Anda sekarang untuk membantu pengelolaan pendaftaran, pencatatan skor, dan verifikasi peserta perlombaan RT 04.
            </p>
          </div>

          <div className="text-xs font-medium tracking-wide text-white/75">
            &copy; 2026 HUTRI-81. Dirgahayu Indonesia
          </div>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center p-6 sm:p-10 lg:w-1/2",
          isDark ? "bg-[#141414]" : "bg-[#f8f6f6]"
        )}
      >
        <div className="w-full max-w-[440px] space-y-8 animate-fade-in">
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
              Buat Akun Baru
            </h2>
            <p className={cn("text-sm sm:text-base font-normal leading-relaxed", isDark ? "text-neutral-400" : "text-neutral-600")}>
              Isi data di bawah ini untuk membuat akun panitia pengelola perlombaan.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className={cn("text-sm font-bold tracking-tight", isDark ? "text-neutral-200" : "text-[#1b0d0d]")}>
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                className={cn(
                  "h-13 w-full rounded-xl border p-4 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                  isDark
                    ? "border-neutral-800 bg-neutral-900/80 text-white placeholder:text-neutral-600"
                    : "border-neutral-300 bg-white text-[#1b0d0d] placeholder:text-neutral-400"
                )}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className={cn("text-sm font-bold tracking-tight", isDark ? "text-neutral-200" : "text-[#1b0d0d]")}>
                Username
              </label>
              <input
                type="text"
                placeholder="Contoh: budi_rt04"
                className={cn(
                  "h-13 w-full rounded-xl border p-4 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                  isDark
                    ? "border-neutral-800 bg-neutral-900/80 text-white placeholder:text-neutral-600"
                    : "border-neutral-300 bg-white text-[#1b0d0d] placeholder:text-neutral-400"
                )}
                {...form.register("username")}
              />
              {form.formState.errors.username ? (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.username.message}</p>
              ) : (
                <p className="text-[11px] text-neutral-500">Username akan digunakan untuk masuk sistem (tanpa perlu email).</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={cn("text-sm font-bold tracking-tight", isDark ? "text-neutral-200" : "text-[#1b0d0d]")}>
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className={cn(
                    "h-13 w-full rounded-xl border p-4 pr-12 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                    isDark
                      ? "border-neutral-800 bg-neutral-900/80 text-white placeholder:text-neutral-600"
                      : "border-neutral-300 bg-white text-[#1b0d0d] placeholder:text-neutral-400"
                  )}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className={cn("text-sm font-bold tracking-tight", isDark ? "text-neutral-200" : "text-[#1b0d0d]")}>
                Ulangi Kata Sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ketik ulang kata sandi Anda"
                  className={cn(
                    "h-13 w-full rounded-xl border p-4 pr-12 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                    isDark
                      ? "border-neutral-800 bg-neutral-900/80 text-white placeholder:text-neutral-600"
                      : "border-neutral-300 bg-white text-[#1b0d0d] placeholder:text-neutral-400"
                  )}
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 text-neutral-400 transition-colors hover:text-primary"
                  aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-xl bg-[#ee2b2b] text-base font-extrabold text-white shadow-lg transition-all duration-200 hover:bg-[#d92020] hover:shadow-primary/30 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 mt-2"
            >
              {isPending ? "Mendaftarkan Akun..." : "Daftar Akun Sekarang"}
            </button>
          </form>

          <div
            className={cn(
              "border-t pt-6 text-center text-sm font-medium",
              isDark ? "border-neutral-800 text-neutral-400" : "border-neutral-200 text-neutral-600"
            )}
          >
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
