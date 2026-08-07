import { z } from "zod";

export const entryTypeSchema = z.enum(["SOLO", "TEAM"]);
export const competitionTypeSchema = z.enum(["SOLO", "TEAM", "BOTH"]);
export const participantRoleSchema = z.enum(["LEADER", "MEMBER"]);
export const registrationStatusSchema = z.enum([
  "SUBMITTED",
  "VERIFIED",
  "CANCELLED",
  "CHECKED_IN",
]);

export const participantSchema = z.object({
  fullName: z.string().min(2, "Nama peserta wajib diisi"),
  birthDate: z.string().min(4, "Tanggal lahir wajib diisi"),
  role: participantRoleSchema,
});

export const registrationSchema = z.object({
  competitionId: z.string().min(1),
  ageCategoryId: z.string().min(1),
  entryType: entryTypeSchema,
  contactName: z.string().min(2, "Nama kontak wajib diisi"),
  contactPhone: z.string().min(6, "Nomor HP wajib diisi"),
  participants: z.array(participantSchema).min(1),
  honeypot: z.string().optional(),
});

export const adminSignInSchema = z.object({
  email: z.string().min(2, "Username atau email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerAccountSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z
    .string()
    .min(2, "Username minimal 2 karakter")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username hanya boleh huruf, angka, titik, atau strip (tanpa spasi)"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi kata sandi minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

export const setupAdminSchema = z.object({
  name: z.string().min(3, "Nama admin minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export const createUserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z
    .string()
    .min(2, "Username minimal 2 karakter")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username hanya boleh huruf, angka, titik, atau strip (tanpa spasi)"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
  role: z.enum(["ADMIN", "PANITIA"]).default("PANITIA"),
});

export const editUserSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Kata sandi baru minimal 6 karakter jika ingin dirubah",
    }),
});

const optionalPositiveInt = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().int().positive(),
);

export const competitionFormSchema = z.object({
  eventId: z.coerce.number().int().positive(),
  name: z.string().min(2, "Nama lomba wajib diisi"),
  type: competitionTypeSchema,
  quotaTotal: optionalPositiveInt.optional().nullable(),
  minMembers: z.coerce.number().int().min(1),
  maxMembers: z.coerce.number().int().min(1),
});

export const ageCategoryFormSchema = z.object({
  competitionId: z.coerce.number().int().positive(),
  name: z.string().min(2, "Nama kategori wajib diisi"),
  ageMin: z.coerce.number().int().min(1),
  ageMax: z.coerce.number().int().min(1),
});

export const updateStatusSchema = z.object({
  registrationId: z.coerce.number().int().positive(),
  status: registrationStatusSchema,
});

export const checkinSchema = z.object({
  publicCode: z.string().min(4, "Kode tidak valid"),
});

export const registrationFilterSchema = z.object({
  q: z.string().optional(),
  competitionId: z.string().optional(),
  ageCategoryId: z.string().optional(),
  status: registrationStatusSchema.optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type CompetitionFormInput = z.infer<typeof competitionFormSchema>;
export type AgeCategoryFormInput = z.infer<typeof ageCategoryFormSchema>;
