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
    createProject(input) {
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
    getProject(id) {
        return prisma.project.findUnique({
            where: { id },
            include: {
                adrs: { orderBy: { createdAt: "desc" } },
            },
        });
    },
};
//# sourceMappingURL=projectsService.js.map