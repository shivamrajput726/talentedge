export declare const projectsService: {
    listProjects(): import("@prisma/client").Prisma.PrismaPromise<({
        adrs: {
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
        }[];
    } & {
        name: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createProject(input: {
        name: string;
        description: string;
    }): import("@prisma/client").Prisma.Prisma__ProjectClient<{
        adrs: {
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
        }[];
    } & {
        name: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        log: ("error" | "warn")[];
    }>;
    getProject(id: string): import("@prisma/client").Prisma.Prisma__ProjectClient<({
        adrs: {
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
        }[];
    } & {
        name: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
        log: ("error" | "warn")[];
    }>;
};
//# sourceMappingURL=projectsService.d.ts.map