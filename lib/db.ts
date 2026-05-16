import prisma from './prisma';

export const db = {
  profile: {
    get: (userId: string) =>
      prisma.profile.findUnique({ where: { userId } }),
    upsert: (userId: string, data: any) =>
      prisma.profile.upsert({
        where: { userId },
        create: { ...data, userId },
        update: { ...data }
      })
  },
  cvUpload: {
    getLatest: (userId: string) =>
      prisma.cVUpload.findFirst({
        where: { userId },
        orderBy: { uploadedAt: 'desc' }
      }),
    replaceAndCreate: async (userId: string, data: any) => {
      // Clean up old uploads to keep it isolated/clean if requested
      await prisma.cVUpload.deleteMany({ where: { userId } });
      return prisma.cVUpload.create({ data: { ...data, userId } });
    }
  },
  analysis: {
    getLatest: (userId: string) =>
      prisma.analysis.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      }),
    create: (userId: string, data: any) =>
      prisma.analysis.create({ data: { ...data, userId } }),
    update: (id: string, data: any) =>
      prisma.analysis.update({ where: { id }, data }),
    getAll: (userId: string) =>
      prisma.analysis.findMany({ where: { userId } }),
    upsertLatest: async (userId: string, data: any) => {
      const latest = await prisma.analysis.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      if (latest) {
        return prisma.analysis.update({
          where: { id: latest.id },
          data
        });
      }
      return prisma.analysis.create({ data: { ...data, userId } });
    }
  },
  roadmap: {
    getProgress: (userId: string) =>
      (prisma as any).roadmapProgress.findMany({ where: { userId } }),
    upsertProgress: (userId: string, taskId: string, weekId: string, completed: boolean) =>
      (prisma as any).roadmapProgress.upsert({
        where: { userId_taskId: { userId, taskId } },
        create: { userId, taskId, weekId, completed },
        update: { completed }
      })
  },
  user: {
    findById: (id: string) => prisma.user.findUnique({ where: { id } }),
    findUnique: (args: any) => prisma.user.findUnique(args),
    update: (args: any) => prisma.user.update(args),
  }
};
