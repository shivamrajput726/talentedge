import { prisma } from "../db/prisma.js";

export const projectsService = {
  listProjects() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        adrs: { orderBy: { createdAt: "desc" } },
      },
    });
  },

  createProject(input: { name: string; description: string }) {
    return prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
      },
      include: {
        adrs: true,
      },
    });
  },

  getProject(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        adrs: { orderBy: { createdAt: "desc" } },
      },
    });
  },
};

