import { AiStatus } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { aiQueue } from "../queues/aiQueue.js";
export const adrsService = {
    listProjectAdrs(projectId) {
        return prisma.adr.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
        });
    },
    async createAdrDraftJob(projectId, input) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            return null;
        }
        const adr = await prisma.adr.create({
            data: {
                projectId,
                title: input.title,
                status: "Proposed",
                context: input.context,
                options: input.options,
                preferredOption: input.preferredOption ?? null,
                decision: "",
                consequences: "",
                aiStatus: AiStatus.pending,
            },
        });
        await aiQueue.add("generateAdr", { type: "generateAdr", adrId: adr.id });
        return adr;
    },
    async getAdr(adrId) {
        return prisma.adr.findUnique({ where: { id: adrId } });
    },
    async createAdrReviewJob(adrId) {
        const adr = await prisma.adr.findUnique({ where: { id: adrId } });
        if (!adr || adr.aiStatus !== AiStatus.ready) {
            return null;
        }
        const review = await prisma.adrReview.create({
            data: {
                adrId: adr.id,
                summary: "",
                strengths: [],
                risks: [],
                suggestedImprovements: [],
                aiStatus: AiStatus.pending,
            },
        });
        await aiQueue.add("reviewAdr", { type: "reviewAdr", reviewId: review.id });
        return review;
    },
    async getReview(reviewId) {
        return prisma.adrReview.findUnique({ where: { id: reviewId } });
    },
    async createProjectHealthCheckJob(projectId) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project)
            return null;
        const healthCheck = await prisma.projectHealthCheck.create({
            data: {
                projectId,
                result: {},
                aiStatus: AiStatus.pending,
            },
        });
        await aiQueue.add("projectHealthCheck", {
            type: "projectHealthCheck",
            healthCheckId: healthCheck.id,
        });
        return healthCheck;
    },
    async getLatestHealthCheck(projectId) {
        return prisma.projectHealthCheck.findFirst({
            where: { projectId },
            orderBy: { createdAt: "desc" },
        });
    },
};
//# sourceMappingURL=adrsService.js.map