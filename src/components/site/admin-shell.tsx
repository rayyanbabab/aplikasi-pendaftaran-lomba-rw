"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Trophy, 
  ClipboardList, 
  QrCode, 
  UserCog, 
  LogOut, 
  PanelLeftClose, 
  PanelLeftOpen, 
  PartyPopper, 
  ShieldAlert, 
  ShieldCheck,
  Calendar, 
  ChevronRight,
  Flame,
  Camera,
  LayoutGrid,
  X
} from "lucide-react";

import { adminSignOut } from "@/actions/auth";
import { ThemeToggle, SidebarThemeSwitch } from "@/components/site/theme-toggle";
import { Logo81 } from "@/components/site/logo-81";
import type { Session } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  session,
  userRole,
}: {
  children: React.ReactNode;
  session: Session;
  userRole?: string;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const role = userRole || (session.user as { role?: string }).role || "PANITIA";
  const isAdmin = role === "ADMIN";

  // Daftar Menu Navigasi Utama (Untuk Sidebar Desktop & Panel Lengkap Bottom Sheet)
  const menuItems = React.useMemo(() => {
    const baseItems = [
      {
        title: "Ringkasan",
        subtext: "Pusat Kendali",
        href: "/portal",
        icon: LayoutDashboard,
        color: "text-red-500 dark:text-red-400",
      },
      {
        title: "Daftar Lomba",
        subtext: "Kelola Pertandingan",
        href: "/portal/lomba",
        icon: Trophy,
        color: "text-amber-500 dark:text-amber-400",
      },
      {
        title: "Data Pendaftaran",
        subtext: "Verifikasi Peserta",
        href: "/portal/pendaftaran",
        icon: ClipboardList,
        color: "text-emerald-500 dark:text-emerald-400",
      },
      {
        title: "Check-in Lapangan",
        subtext: "Absensi & QR Scanner",
        href: "/portal/checkin",
        icon: QrCode,
        color: "text-blue-500 dark:text-blue-400",
      },
      {
        title: "Galeri Acara",
        subtext: "Dokumentasi & Foto",
        href: "/portal/galeri",
        icon: Camera,
        color: "text-purple-500 dark:text-purple-400",
      },
    ];

    if (isAdmin) {
      baseItems.push({
        title: "Manajemen User",
        subtext: "Kelola Staf Panitia",
        href: "/portal/users",
        icon: UserCog,
        color: "text-red-500 dark:text-red-400",
      });
    }

    return baseItems;
  }, [isAdmin]);

  // Susunan 5 Tombol Simetris untuk Navigasi Bawah Mobile
  const mobileNavItems = React.useMemo(() => [
    {
      label: "Ringkasan",
      href: "/portal",
      icon: LayoutDashboard,
      color: "text-red-500 dark:text-red-400",
      isAction: false,
    },
    {
      label: "Lomba", // Diganti dari "Daftar"
      href: "/portal/lomba",
      icon: Trophy,
      color: "text-amber-500 dark:text-amber-400",
      isAction: false,
    },
    {
      label: "Menu", // Tombol pusat pemicu Bottom Sheet
      href: "#menu",
      icon: LayoutGrid,
      color: "text-purple-500 dark:text-purple-400",
      isAction: true,
    },
    {
      label: "Peserta", // Diganti dari "Data"
      href: "/portal/pendaftaran",
      icon: ClipboardList,
      color: "text-emerald-500 dark:text-emerald-400",
      isAction: false,
    },
    {
      label: "Scan", // Diganti dari "Check-in"
      href: "/portal/checkin",
      icon: QrCode,
      color: "text-blue-500 dark:text-blue-400",
      isAction: false,
    },
  ], []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-muted/15 to-background text-foreground selection:bg-primary/20">
      {/* ========================================================= */}
      {/* 🖥️ DESKTOP & TABLET SIDEBAR (Collapsible & Glassmorphism) */}
      {/* ========================================================= */}
      {/* Spacer untuk mengimbangi lebar sidebar fixed pada layar Desktop/Tablet */}
      <div className={cn("hidden shrink-0 transition-all duration-300 md:block", isCollapsed ? "w-20" : "w-72")} />

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 hidden h-screen shrink-0 flex-col justify-between bg-card/85 backdrop-blur-2xl transition-all duration-300 ease-in-out md:flex shadow-xl shadow-black/5 dark:shadow-black/20",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* TOP SECTION: LOGO & BRAND */}
        <div>
          <div className="flex h-20 items-center justify-between px-4">
            {!isCollapsed ? (
              <div className="flex w-full items-center justify-between gap-2 overflow-hidden">
                <Link
                  href="/"
                  title="Ke Beranda Web"
                  className="flex items-center gap-3 overflow-hidden truncate"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ee2b2b] text-white shadow-lg shadow-primary/30 ring-1 ring-white/20 p-1 overflow-hidden">
                    <Logo81 className="h-full w-full object-contain" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-base font-black tracking-tight text-foreground flex items-center gap-1">
                      Semarak 17-an <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                      RT 04
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title="Sembunyikan Sidebar (Hide)"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-center">
                <div className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ee2b2b] text-white shadow-lg shadow-primary/30 ring-1 ring-white/20 p-1 overflow-hidden">
                  <Link
                    href="/"
                    title="Ke Beranda Web"
                    className="flex h-full w-full items-center justify-center transition-opacity duration-200 group-hover:opacity-0"
                  >
                    <Logo81 className="h-full w-full object-contain" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(false)}
                    title="Buka Lebar Sidebar (Show)"
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-foreground text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 shadow-md"
                  >
                    <PanelLeftOpen className="h-5 w-5 text-background" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MENU NAVIGATION LINKS */}
          <nav className="space-y-1.5 px-3 py-6">
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-muted-foreground/80">
                Menu Utama Dasbor
              </p>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? `${item.title} - ${item.subtext}` : undefined}
                  className={cn(
                    "group relative flex items-center rounded-xl text-sm font-bold transition-all duration-200",
                    isCollapsed
                      ? "h-12 w-12 aspect-square justify-center p-0 mx-auto shrink-0"
                      : "w-full gap-3.5 px-3.5 py-3",
                    isActive
                      ? "bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] text-white shadow-lg shadow-primary/25 font-black scale-[1.02]"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-white" : item.color
                    )}
                  />
                  {!isCollapsed && (
                    <div className="flex w-full items-center justify-between truncate">
                      <span className="truncate">{item.title}</span>
                      {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-white/80" />}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: USER PROFILE & THEME SWITCH CONTROLS */}
        <div className="p-3 bg-muted/20 space-y-2.5">
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm transition-all",
              isCollapsed ? "justify-center p-2" : ""
            )}
          >
            {!isCollapsed ? (
              <>
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-md transition-transform hover:scale-105",
                    isAdmin ? "bg-gradient-to-tr from-[#ee2b2b] to-[#e01d1d] shadow-red-500/25" : "bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-500/25"
                  )}
                  title={session.user.name ?? session.user.email}
                >
                  {isAdmin ? "⚡" : "🛡️"}
                </div>

                <div className="flex flex-1 flex-col truncate pr-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate text-sm font-black text-foreground">
                      {session.user.name ?? session.user.email?.replace("@rt04.id", "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
                        isAdmin
                          ? "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30"
                          : "bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30"
                      )}
                    >
                      {isAdmin ? <ShieldAlert className="h-2.5 w-2.5" /> : <ShieldCheck className="h-2.5 w-2.5" />}
                      {role}
                    </span>
                  </div>
                </div>

                {/* Logout Button when Expanded */}
                <form action={adminSignOut}>
                  <button
                    type="submit"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-500/15 hover:text-red-600"
                    title="Keluar dari Akun (Logout)"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              /* Hover Interactive Profile / Logout when Collapsed */
              <div className="group relative flex h-10 w-10 shrink-0 items-center justify-center">
                <div
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-xl text-sm font-black text-white shadow-md transition-opacity duration-200 group-hover:opacity-0",
                    isAdmin ? "bg-gradient-to-tr from-[#ee2b2b] to-[#e01d1d] shadow-red-500/25" : "bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-500/25"
                  )}
                  title={session.user.name ?? session.user.email}
                >
                  {isAdmin ? "⚡" : "🛡️"}
                </div>
                <form action={adminSignOut} className="absolute inset-0">
                  <button
                    type="submit"
                    className="flex h-full w-full items-center justify-center rounded-xl bg-red-600 text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100 hover:bg-red-500 scale-95 group-hover:scale-100"
                    title="Keluar dari Akun (Logout)"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Quick Theme Switcher in Sidebar (Di bawah akun pengguna) */}
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="rounded-xl border border-border/60 bg-card shadow-xs shrink-0">
                <ThemeToggle />
              </div>
            </div>
          ) : (
            <div className="px-0.5">
              <SidebarThemeSwitch />
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 🚀 MAIN CONTENT & TOP HEADER BAR                          */}
      {/* ========================================================= */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        {/* TOP HEADER BAR (Khusus Mobile) */}
        <header className="fixed top-0 left-0 right-0 z-40 flex h-20 items-center justify-between bg-card/85 px-4 backdrop-blur-xl sm:px-6 md:hidden shadow-sm">
          <Link href="/" title="Ke Beranda Web" className="flex items-center gap-3 overflow-hidden truncate">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ee2b2b] text-white shadow-lg shadow-primary/30 ring-1 ring-white/20 p-1 overflow-hidden">
              <Logo81 className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-base font-black tracking-tight text-foreground flex items-center gap-1">
                Semarak 17-an <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                RT 04
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* MAIN BODY WORKSPACE */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-[6.5rem] pb-28 sm:px-6 md:pt-8 md:pb-12 animate-fade-in">
          {children}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 🔮 MOBILE MENU POPUP CARD (Muncul DI ATAS Navigasi Bawah) */}
      {/* ========================================================= */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop gelap transparan di lapisan bawah navbar dan modal (z-50) */}
          <div 
            className="fixed inset-0 bg-black/65 transition-opacity animate-fade-in z-50 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Panel Menu Solid (Tanpa Transparan) melayang pas di atas navigasi bawah (z-[60]) */}
          <div className="fixed bottom-[5.9rem] left-3 right-3 max-h-[50vh] overflow-y-auto rounded-3xl border border-[#2e2e2e]/80 dark:border-border/80 bg-card p-6 shadow-[0_10px_45px_rgba(0,0,0,0.5)] transition-all animate-fade-in-up duration-250 z-[60] md:hidden dark:bg-[#14181f]">
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#2e2e2e]/60 dark:border-border/60">
              <div>
                <h3 className="text-base font-extrabold tracking-tight text-white dark:text-foreground">Semua Menu Dasbor</h3>
                <p className="text-[11px] font-medium text-white/90 dark:text-foreground/75">Pilih modul navigasi atau kelola sistem panitia</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-white dark:text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Tutup Panel Menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Grid Semua Menu Dasbor */}
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2.5 p-3.5 rounded-2xl border transition-all text-center group",
                      isActive
                        ? "border-primary/50 dark:border-white bg-primary/10 text-white dark:text-primary shadow-xs font-bold"
                        : "border-[#2e2e2e]/80 dark:border-border/80 bg-muted/20 text-white dark:text-foreground/80 hover:bg-muted font-semibold hover:text-white dark:hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
                        isActive ? "bg-[#ee2b2b] text-white shadow-md shadow-primary/30" : "bg-background shadow-xs text-white dark:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", !isActive && item.color)} />
                    </div>
                    <span className="text-xs tracking-tight line-clamp-1">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Aksi Tambahan di Bawah Grid: Ke Beranda Web & Logout */}
            <div className="mt-6 pt-4 border-t border-[#2e2e2e]/60 dark:border-border/60 flex items-center gap-3">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl border border-[#2e2e2e]/80 dark:border-border/80 bg-background text-xs font-bold text-white dark:text-foreground hover:bg-muted transition-colors shadow-xs"
              >
                🏠 Beranda Web
              </Link>
              <form action={adminSignOut} className="flex-1 flex">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-xs"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar Akun
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 📱 MOBILE BOTTOM NAVIGATION (5 MENU PENTING UNTUK HP)     */}
      {/* ========================================================= */}
      <nav className="fixed bottom-3 left-3 right-3 z-[60] flex items-center justify-around rounded-2xl border border-[#2e2e2e]/80 dark:border-border/80 bg-card py-2 px-1 shadow-[0_10px_35px_rgba(0,0,0,0.4)] md:hidden dark:bg-[#14181f]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isAction ? isMobileMenuOpen : pathname === item.href;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-white dark:text-primary font-black scale-105"
                    : "text-white dark:text-muted-foreground hover:text-white dark:hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                    isActive
                      ? "bg-gradient-to-tr from-[#ee2b2b] to-[#ff5e5e] text-white shadow-md shadow-primary/30"
                      : "bg-transparent"
                  )}
                >
                  <Icon className={cn("h-5 w-5", !isActive && item.color)} />
                </div>
                <span className="text-[10px] font-extrabold tracking-tight truncate max-w-[64px]">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl transition-all duration-200",
                isActive
                  ? "text-white dark:text-primary font-black scale-105"
                  : "text-white dark:text-muted-foreground hover:text-white dark:hover:text-foreground"
                )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                  isActive
                    ? "bg-gradient-to-tr from-[#ee2b2b] to-[#ff5e5e] text-white shadow-md shadow-primary/30"
                    : "bg-transparent"
                  )}
                >
                <Icon className={cn("h-5 w-5", !isActive && item.color)} />
              </div>
              <span className="text-[10px] font-extrabold tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
