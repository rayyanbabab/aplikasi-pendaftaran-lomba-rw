"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, PartyPopper, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { setupFirstAdmin } from "@/actions/auth";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { setupAdminSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { z } from "zod";

type SetupAdminInput = z.infer<typeof setupAdminSchema>;

export function SetupAdminForm() {
  const router = useRouter();
  const form = useForm<SetupAdminInput>({
    resolver: zodResolver(setupAdminSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const { resolvedTheme } = useTheme();
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isHover, setIsHover] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const onSubmit = (values: SetupAdminInput) => {
    startTransition(async () => {
      const result = await setupFirstAdmin(values);
      if (!result.ok) {
        toast.error(result.error || "Gagal melakukan setup akun.");
        return;
      }
      toast.success("✅ Akun Admin Utama berhasil didirikan!");
      router.push("/portal");
      router.refresh();
    });
  };

  return (
    <div
      className={cn(
        "relative flex min-h-screen transition-colors duration-200",
        isDark ? "bg-[#221010] text-white" : "bg-[#f8f6f6] text-[#1b0d0d]"
      )}
    >
      <div className="absolute right-6 top-6 z-50">
        <ThemeToggle />
      </div>
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#ee2b2b] via-[#d91e1e] to-[#991414] lg:flex">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center mix-blend-overlay",
            isDark ? "opacity-35" : "opacity-30"
          )}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-eqURzXMCDofVV5BRZHSaVNULfF65g_dmipjoaWf_IsZF_sMvt6kOzstDsJBqXWnxDEiN5105G5acKfOs4RtuKKGqIjK2gslHUHISRa4bq99x_WkeQQFe-Chseb_BbyC6hx_C7b6twPIs5ZDJmNB_9Ivu2VSA_ps39ybiwiIWnzq0Nz1zs_Z95eQUS4htf2TrXk0FQxaEoKwSxdZxdJ1V3nlTaUDIAOIj4Q4dg7stLc6XIL0Ko0nhYPhartaiuX5nNNTTuyYwRW70')",
          }}
        />
        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 shadow-lg backdrop-blur-md">
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight block">Inisiasi Sistem RT 04</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 block">Setup Administrator Pertama</span>
            </div>
          </div>
          <div className="max-w-md space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-md text-xs font-bold text-yellow-200">
              <ShieldAlert className="h-4 w-4" /> Mode Setup Database Aktif
            </div>
            <h1 className="text-5xl font-black leading-tight">Mulai Membangun Kendali Lomba.</h1>
            <p className="text-lg font-medium leading-relaxed opacity-95">
              Sistem mendeteksi belum terdapat akun Admin atau Panitia pada database Supabase Anda. Buat akun Admin Utama sekarang untuk mendapatkan kendali penuh atas sistem ini.
            </p>
          </div>
          <div className="text-sm font-medium opacity-70">
            {"\u00A9"} 2026 Panitia HUT RI ke-81 RT 04. Hak Cipta Dilindungi.
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex w-full flex-col items-center justify-center p-8 lg:w-1/2",
          isDark ? "bg-[#221010]" : "bg-[#f8f6f6]"
        )}
      >
        <div className="w-full max-w-[440px] space-y-8 animate-fade-in-up">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 dark:text-amber-400 mb-2">
              ⚡ Setup Akun Admin Utama
            </div>
            <h2
              className={cn(
                "text-3xl font-black leading-tight tracking-tight",
                isDark ? "text-white" : "text-[#1b0d0d]"
              )}
            >
              Buat Akun Administrator
            </h2>
            <p className={cn("text-base font-normal", isDark ? "text-gray-400" : "text-[#9a4c4c]")}>
              Lengkapi kredensial berikut untuk mendirikan hak akses tertinggi di sistem RT 04 ini.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label
                className={cn("text-sm font-bold", isDark ? "text-gray-200" : "text-[#1b0d0d]")}
              >
                Nama Lengkap Admin
              </label>
              <input
                type="text"
                placeholder="Contoh: Ketua Panitia / Admin Utama"
                className={cn(
                  "h-14 w-full rounded-xl border p-4 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                  isDark
                    ? "border-gray-700 bg-[#2d1a1a] text-white placeholder:text-gray-500"
                    : "border-[#e7cfcf] bg-white text-[#1b0d0d] placeholder:text-[#9a4c4c]/50"
                )}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className={cn("text-sm font-bold", isDark ? "text-gray-200" : "text-[#1b0d0d]")}
              >
                Email Admin Utama
              </label>
              <input
                type="email"
                placeholder="Contoh: admin.rt04@gmail.com"
                className={cn(
                  "h-14 w-full rounded-xl border p-4 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                  isDark
                    ? "border-gray-700 bg-[#2d1a1a] text-white placeholder:text-gray-500"
                    : "border-[#e7cfcf] bg-white text-[#1b0d0d] placeholder:text-[#9a4c4c]/50"
                )}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className={cn("text-sm font-bold", isDark ? "text-gray-200" : "text-[#1b0d0d]")}
              >
                Kata Sandi Baru (Min. 6 Karakter)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "h-14 w-full rounded-xl border p-4 pr-12 text-base transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
                    isDark
                      ? "border-gray-700 bg-[#2d1a1a] text-white placeholder:text-gray-500"
                      : "border-[#e7cfcf] bg-white text-[#1b0d0d] placeholder:text-[#9a4c4c]/50"
                  )}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 text-[#9a4c4c] transition-colors hover:text-primary"
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
                "h-14 w-full rounded-xl text-base font-black tracking-[0.015em] shadow-xl shadow-primary/25 transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5",
                isActive
                  ? "bg-[#b91c1c] text-white scale-95"
                  : isHover
                    ? "bg-[#c92020] text-white shadow-primary/40"
                    : "bg-[#ee2b2b] text-white"
              )}
            >
              {isPending ? "Sedang Mendaftarkan Akun..." : "Buat Akun Admin & Selesaikan Setup 🚀"}
            </button>
          </form>

          <div
            className={cn(
              "border-t pt-6 text-center text-xs font-medium",
              isDark ? "border-gray-800 text-gray-500" : "border-[#e7cfcf] text-[#9a4c4c]"
            )}
          >
            💡 Catatan: Halaman setup ini hanya tampil sekali saat database masih kekeringan akun admin. Setelah Anda berhasil mendaftar, rute ini akan mengarah otomatis ke halaman login biasa.
          </div>

          <div
            className={cn(
              "flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest",
              isDark ? "text-gray-500" : "text-[#9a4c4c]/60"
            )}
          >
            <UserCheck className="h-4 w-4 text-primary" />
            RT 04 Automated Initial Bootstrap
          </div>
        </div>
      </div>
    </div>
  );
}
