import type { AdrDraftInput } from "./aiService.js";
export declare const adrsService: {
    listProjectAdrs(projectId: string): import("@prisma/client").Prisma.PrismaPromise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        title: string;
        status: string;
        context: string;
        options: import("@prisma/client/runtime/library").JsonValue;
        preferredOption: string | null;
        decision: string;
        consequences: string;
        aiStatus: import("@prisma/client").$Enums.AiStatus;
    }[]>;
    createAdrDraftJob(projectId: string, input: Omit<AdrDraftInput, "project">): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        title: string;
        status: string;
        context: string;
        options: import("@prisma/client/runtime/library").JsonValue;
        preferredOption: string | null;
        decision: string;
        consequences: string;
        aiStatus: import("@prisma/client").$Enums.AiStatus;
    } | null>;
    getAdr(adrId: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        title: string;
        status: string;
        context: string;
        options: import("@prisma/client/runtime/library").JsonValue;
        preferredOption: string | null;
        decision: string;
        consequences: string;
        aiStatus: import("@prisma/client").$Enums.AiStatus;
    } | null>;
    createAdrReviewJob(adrId: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        aiStatus: import("@prisma/client").$Enums.AiStatus;
        summary: string;
        strengths: import("@prisma/client/runtime/library").JsonValue;
        risks: import("@prisma/client/runtime/library").JsonValue;
        suggestedImprovements: import("@prisma/client/runtime/library").JsonValue;
        adrId: string;
    } | null>;
    getReview(reviewId: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        aiStatus: import("@prisma/client").$Enums.AiStatus;
        summary: string;
        strengths: import("@prisma/client/runtime/library").JsonValue;
        risks: import("@prisma/client/runtime/library").JsonValue;
        suggestedImprovements: import("@prisma/client/runtime/library").JsonValue;
        adrId: string;
    } | null>;
    createProjectHealthCheckJob(projectId: string): Promise<{
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        aiStatus: import("@prisma/client").$Enums.AiStatus;
    } | null>;
    getLatestHealthCheck(projectId: string): Promise<{
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        aiStatus: import("@prisma/client").$Enums.AiStatus;
    } | null>;
};
//# sourceMappingURL=adrsService.d.ts.map