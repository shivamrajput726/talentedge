import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    FRONTEND_ORIGIN: z.string().default("*"),
    LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
        .default("info"),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
    AI_PROVIDER: z.enum(["openai", "stub"]).default("stub"),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().min(1).default("gpt-5-mini"),
});
export const env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map