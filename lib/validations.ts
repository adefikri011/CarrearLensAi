import { z } from "zod";

export const ProfileSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  usia: z.number().min(15).max(40),
  lulusan: z.string().min(1),
  jurusan: z.string().optional(),
  hardSkills: z.array(z.string()),
  softSkills: z.array(z.string()),
  minat: z.array(z.string()),
  targetGaji: z.number().min(0),
  targetPosisi: z.object({
    posisi1th: z.string(),
    posisi3th: z.string(),
    posisi5th: z.string(),
  }),
  preferensiKerja: z.string(),
  kotaTarget: z.array(z.string()),
  sertifikasi: z.array(z.string()),
  pengalaman: z.any().nullable(),
});

export type ProfileData = z.infer<typeof ProfileSchema>;
