import { PrismaClient } from "@prisma/client";
import { env } from "../env.js";
export const prisma = new PrismaClient({
    log: env.NODE_ENV === "development"
        ? ["warn", "error"]
        : env.NODE_ENV === "test"
            ? ["error"]
            : ["warn", "error"],
});
//# sourceMappingURL=prisma.js.map