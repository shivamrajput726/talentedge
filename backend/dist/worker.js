import "dotenv/config";
import { Worker } from "bullmq";
import { AiStatus } from "@prisma/client";
import pino from "pino";
import { env } from "./env.js";
import { prisma } from "./db/prisma.js";
import { AI_QUEUE_NAME, redisConnection } from "./queues/aiQueue.js";
import { aiService } from "./services/aiService.js";
const logger = pino({ level: env.LOG_LEVEL });
const worker = new Worker(AI_QUEUE_NAME, async (job) => {
    const payload = job.data;
    if (payload.type === "generateAdr") {
        const adr = await prisma.adr.findUnique({
            where: { id: payload.adrId },
            include: { project: true },
        });
        if (!adr)
            return;
        await prisma.adr.update({
            where: { id: adr.id },
            data: { aiStatus: AiStatus.processing, error: null },
        });
        try {
            const options = Array.isArray(adr.options)
                ? adr.options
                : [];
            const draft = await aiService.generateAdrDraft({
                project: {
                    id: adr.project.id,
                    name: adr.project.name,
                    description: adr.project.description,
                },
                title: adr.title,
                context: adr.context,
                options,
                ...(adr.preferredOption ? { preferredOption: adr.preferredOption } : {}),
            });
            await prisma.adr.update({
                where: { id: adr.id },
                data: {
                    title: draft.title,
                    status: draft.status,
                    context: draft.context,
                    decision: draft.decision,
                    consequences: draft.consequences,
                    aiStatus: AiStatus.ready,
                    error: null,
                },
            });
        }
        catch (err) {
            logger.error({ err }, "ADR generation failed");
            await prisma.adr.update({
                where: { id: adr.id },
                data: {
                    aiStatus: AiStatus.failed,
                    error: err instanceof Error ? err.message : "Unknown error",
                },
            });
        }
        return;
    }
    if (payload.type === "reviewAdr") {
        const review = await prisma.adrReview.findUnique({
            where: { id: payload.reviewId },
            include: { adr: true },
        });
        if (!review)
            return;
        await prisma.adrReview.update({
            where: { id: review.id },
            data: { aiStatus: AiStatus.processing, error: null },
        });
        const adrMarkdown = `# ${review.adr.title}

**Status:** ${review.adr.status}

## Context
${review.adr.context}

## Decision
${review.adr.decision}

## Consequences
${review.adr.consequences}`;
        try {
            const aiReview = await aiService.reviewAdr(adrMarkdown);
            await prisma.adrReview.update({
                where: { id: review.id },
                data: {
                    summary: aiReview.summary,
                    strengths: aiReview.strengths,
                    risks: aiReview.risks,
                    suggestedImprovements: aiReview.suggestedImprovements,
                    aiStatus: AiStatus.ready,
                    error: null,
                },
            });
        }
        catch (err) {
            logger.error({ err }, "ADR review failed");
            await prisma.adrReview.update({
                where: { id: review.id },
                data: {
                    aiStatus: AiStatus.failed,
                    error: err instanceof Error ? err.message : "Unknown error",
                },
            });
        }
        return;
    }
    if (payload.type === "projectHealthCheck") {
        const healthCheck = await prisma.projectHealthCheck.findUnique({
            where: { id: payload.healthCheckId },
            include: { project: true },
        });
        if (!healthCheck)
            return;
        await prisma.projectHealthCheck.update({
            where: { id: healthCheck.id },
            data: { aiStatus: AiStatus.processing, error: null },
        });
        const adrs = await prisma.adr.findMany({
            where: { projectId: healthCheck.projectId, aiStatus: AiStatus.ready },
            orderBy: { createdAt: "desc" },
            take: 25,
        });
        try {
            const result = await aiService.runProjectHealthCheck({
                project: {
                    id: healthCheck.project.id,
                    name: healthCheck.project.name,
                    description: healthCheck.project.description,
                },
                adrs: adrs.map((a) => ({
                    id: a.id,
                    title: a.title,
                    status: a.status,
                    decision: a.decision,
                    consequences: a.consequences,
                })),
            });
            await prisma.projectHealthCheck.update({
                where: { id: healthCheck.id },
                data: {
                    result,
                    aiStatus: AiStatus.ready,
                    error: null,
                },
            });
        }
        catch (err) {
            logger.error({ err }, "Project health check failed");
            await prisma.projectHealthCheck.update({
                where: { id: healthCheck.id },
                data: {
                    aiStatus: AiStatus.failed,
                    error: err instanceof Error ? err.message : "Unknown error",
                },
            });
        }
        return;
    }
}, {
    connection: redisConnection,
    concurrency: 3,
});
worker.on("completed", (job) => {
    logger.info({ jobId: job.id, name: job.name }, "job completed");
});
worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, name: job?.name, err }, "job failed");
});
async function shutdown(signal) {
    logger.info({ signal }, "shutting down worker");
    await worker.close();
    await prisma.$disconnect();
    process.exit(0);
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
//# sourceMappingURL=worker.js.map