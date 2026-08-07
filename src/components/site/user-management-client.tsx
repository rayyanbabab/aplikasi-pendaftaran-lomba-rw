"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  UserPlus, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Pencil, 
  X, 
  Check 
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { createUserAccount, deleteUserAccount, editUserAccount } from "@/actions/admin-users";
import { createUserSchema, editUserSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

type CreateUserInput = z.infer<typeof createUserSchema>;
type EditUserInput = z.infer<typeof editUserSchema>;

export function UserManagementClient({
  users,
  currentUserId,
}: {
  users: UserRecord[];
  currentUserId: string;
}) {
  const [search, setSearch] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  // State untuk Modal Edit
  const [editingUser, setEditingUser] = React.useState<UserRecord | null>(null);
  const [showEditPassword, setShowEditPassword] = React.useState(false);

  const [isPending, startTransition] = React.useTransition();
  const [activeActionId, setActiveActionId] = React.useState<string | null>(null);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", username: "", password: "", role: "PANITIA" },
  });

  const editForm = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { userId: "", name: "", password: "" },
  });

  const filteredUsers = React.useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const onSubmit = (values: CreateUserInput) => {
    startTransition(async () => {
      const result = await createUserAccount({ ...values, role: "PANITIA" });
      if (!result.ok) {
        toast.error(result.error || "Gagal membuat akun.");
        return;
      }
      toast.success(`🎉 Akun Panitia "${values.username.toLowerCase()}@rt04.id" berhasil didaftarkan!`);
      form.reset({ name: "", username: "", password: "", role: "PANITIA" });
      setShowForm(false);
    });
  };

  const openEditModal = (u: UserRecord) => {
    setEditingUser(u);
    editForm.reset({
      userId: u.id,
      name: u.name,
      password: "",
    });
    setShowEditPassword(false);
  };

  const onEditSubmit = (values: EditUserInput) => {
    startTransition(async () => {
      const res = await editUserAccount(values);
      if (!res.ok) {
        toast.error(res.error || "Gagal menyimpan pengeditan akun.");
        return;
      }
      toast.success(`✅ Perubahan data pada akun ${editingUser?.name} berhasil disimpan ke database!`);
      setEditingUser(null);
    });
  };

  const handleDelete = (user: UserRecord) => {
    if (!window.confirm(`⚠️ Yakin ingin menghapus permanen akun Panitia ${user.name} (${user.email})?`)) return;

    setActiveActionId(user.id);
    startTransition(async () => {
      const res = await deleteUserAccount(user.id);
      if (res.ok) {
        toast.success(`Akun Panitia ${user.name} berhasil dihapus.`);
      } else {
        toast.error(res.error || "Gagal menghapus akun.");
      }
      setActiveActionId(null);
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Manajemen Akun & Panitia
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Pusat kendali staf perlombaan HUT RI ke-81 RT 04. Akun yang ditambahkan di bawah berwenang sebagai Panitia.
          </p>
        </div>
        <Button
          onClick={() => setShowForm((prev) => !prev)}
          className={cn(
            "rounded-xl px-5 py-6 text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.98]",
            showForm
              ? "bg-muted text-foreground hover:bg-muted/80 shadow-none"
              : "bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] text-white shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818] hover:shadow-lg hover:shadow-primary/30"
          )}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          {showForm ? "Tutup Formulir" : "Tambah Panitia Baru"}
        </Button>
      </div>

      {/* Expandable Form Tambah Akun */}
      {showForm && (
        <Card className="border-primary/20 bg-gradient-to-b from-card to-primary/5 shadow-xl animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-primary" /> Daftarkan Anggota Panitia Baru
            </CardTitle>
            <CardDescription>
              Cukup ketikian nama pendek panitia (Tanpa spasi). Sistem akan menyematkan akhiran @rt04.id secara otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Nama Lengkap Panitia</label>
                  <input
                    type="text"
                    placeholder="Contoh: Wahyu (Satgas Check-in Lapangan)"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs font-semibold text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Username / ID Akun</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Contoh: wahyu atau budi.lomba"
                      className="h-12 w-full rounded-xl border border-border bg-background pl-4 pr-24 text-sm font-bold text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      {...form.register("username")}
                    />
                    <span className="pointer-events-none absolute right-2.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-black tracking-wider text-muted-foreground border border-border/80">
                      @rt04.id
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground">Panitia kelak cukup melogin dengan mengetik ID di depan ini saja tanpa butuh email.</p>
                  {form.formState.errors.username && (
                    <p className="text-xs font-semibold text-red-500">{form.formState.errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Kata Sandi Baru</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      className="h-12 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 text-muted-foreground hover:text-primary"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs font-semibold text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Hak Akses (Role)</label>
                  <div className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 text-sm font-black text-orange-700 dark:text-orange-300 shadow-xs">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-orange-500" />
                    <span>🛡️ PANITIA - (Satgas / Pengelola Lapangan)</span>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    ⚡ Akun ADMIN bersifat tunggal (Anda). Staf yang didaftarkan di sini otomatis menjadi Panitia.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl px-6 py-5 font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-8 py-5 font-black text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818] transition-all"
                >
                  {isPending ? "Sedang Mendaftarkan Akun..." : "Simpan & Aktifkan Panitia 🚀"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter & Daftar User Table */}
      <Card className="border-border/80 shadow-md">
        <CardHeader className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-xl font-bold">Daftar Akun Terdaftar ({users.length})</CardTitle>
            <CardDescription>Semua staf pengelola pendaftaran lomba 17 Agustus RT 04 di Supabase</CardDescription>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama, username, atau role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Pengguna & ID Login</th>
                  <th className="px-6 py-4">Hak Akses (Role)</th>
                  <th className="px-6 py-4">Tanggal Daftar</th>
                  <th className="px-6 py-4 text-right">Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-medium">
                      Tidak ada data akun yang cocok dengan kata kunci <span className="font-bold text-primary">&quot;{search}&quot;</span>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.id === currentUserId;
                    const isCustomDomain = u.email.endsWith("@rt04.id");
                    const shortUsername = u.email.replace("@rt04.id", "");
                    const isBusy = activeActionId === u.id;

                    return (
                      <tr key={u.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary/20 to-accent text-sm font-black text-primary border border-primary/20">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-foreground">
                                {u.name} {isSelf && <span className="ml-1.5 inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">Anda (Admin Utama)</span>}
                              </p>
                              <div className="text-xs text-muted-foreground">
                                {isCustomDomain ? (
                                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-extrabold text-primary/90 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                    👤 ID Login: <span className="underline decoration-wavier">{shortUsername}</span> <span className="font-normal opacity-70">({u.email})</span>
                                  </span>
                                ) : (
                                  <span>{u.email}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shadow-sm",
                              u.role === "ADMIN"
                                ? "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30"
                                : "bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30"
                            )}
                          >
                            {u.role === "ADMIN" ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Tombol Edit */}
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              onClick={() => openEditModal(u)}
                              className="rounded-lg border-blue-500/30 bg-blue-500/5 px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-xs"
                              title="Edit Nama atau Reset Password"
                            >
                              <Pencil className="mr-1.5 h-3.5 w-3.5" />
                              Edit
                            </Button>

                            {/* Tombol Hapus - Hanya dimunculkan untuk akun Panitia */}
                            {!isSelf && u.role !== "ADMIN" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleDelete(u)}
                                className="rounded-lg bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-600 shadow-xs transition-all hover:bg-red-500 hover:text-white"
                                title="Hapus Permanen Akun Panitia"
                              >
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                {isBusy ? "Menghapus..." : "Hapus"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL EDIT AKUN (OVERLAY) */}
      {/* MODAL EDIT AKUN (PORTAL KE ROOT BODY SUPAYA PRESISI DI TENGAH & SOLID OPAQUE) */}
      {editingUser &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex h-screen w-screen items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
            <div className="relative my-auto w-full max-w-lg shrink-0 transition-transform">
              <Card className="w-full border-2 border-border/80 bg-white dark:bg-[#171313] text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.7)] opacity-100 animate-scale-in overflow-hidden rounded-2xl">
                <CardHeader className="border-b border-border/60 bg-gray-50/90 dark:bg-[#201919] pb-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-xl font-black text-foreground">
                      <Pencil className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Edit Data & Kredensial Akun
                    </CardTitle>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <CardDescription className="mt-1 font-medium">
                    Perbarui Nama atau reset Kata Sandi untuk akun <span className="font-bold text-primary">{editingUser.email}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 bg-white dark:bg-[#171313]">
                  <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-5">
                    <input type="hidden" {...editForm.register("userId")} />
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-foreground">ID Login / Email Akun (Permanen)</label>
                      <input
                        type="text"
                        disabled
                        value={editingUser.email}
                        className="h-11 w-full rounded-xl border border-border bg-gray-100 dark:bg-[#231b1b] px-4 text-sm font-bold text-muted-foreground opacity-80 cursor-not-allowed"
                      />
                      <p className="text-[11px] font-medium text-muted-foreground">Alamat ID login bersifat tetap untuk mencegah putus koneksi pada sesi yang sedang berjalan.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-foreground">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="Masukkan nama baru panitia"
                        className="h-12 w-full rounded-xl border border-border bg-white dark:bg-[#201919] px-4 text-sm font-bold text-foreground transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        {...editForm.register("name")}
                      />
                      {editForm.formState.errors.name && (
                        <p className="text-xs font-semibold text-red-500">{editForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-foreground">Kata Sandi Baru (Opsional)</label>
                      <div className="relative flex items-center">
                        <input
                          type={showEditPassword ? "text" : "password"}
                          placeholder="Kosongkan jika tidak ingin merubah password lama"
                          className="h-12 w-full rounded-xl border border-border bg-white dark:bg-[#201919] px-4 pr-12 text-sm text-foreground transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          {...editForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowEditPassword((v) => !v)}
                          className="absolute right-4 text-muted-foreground hover:text-blue-500"
                        >
                          {showEditPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        ⚠️ Jika Anda mengisi kolom ini (min. 6 karakter), password lama akan langsung direset dengan yang baru.
                      </p>
                      {editForm.formState.errors.password && (
                        <p className="text-xs font-semibold text-red-500">{editForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-5 border-t border-border/60">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingUser(null)}
                        className="rounded-xl px-5 py-5 font-bold bg-gray-100 dark:bg-transparent"
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] px-6 py-5 font-bold text-white shadow-md shadow-primary/25 hover:from-[#e01d1d] hover:to-[#c91818] transition-all active:scale-[0.98]"
                      >
                        {isPending ? "Sedang Menyimpan..." : "Simpan Perubahan 💾"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
