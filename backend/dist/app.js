import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./env.js";
import { registerRoutes } from "./routes.js";
function parseAllowedOrigins(value) {
    const trimmed = value.trim();
    if (trimmed === "*" || trimmed === "")
        return true;
    return trimmed
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
}
export function createApp() {
    const app = express();
    app.use(pinoHttp({
        level: env.LOG_LEVEL,
    }));
    app.use(helmet());
    const allowedOrigins = parseAllowedOrigins(env.FRONTEND_ORIGIN);
    app.use(cors({
        origin: allowedOrigins === true ? true : allowedOrigins,
    }));
    app.use(express.json({ limit: "1mb" }));
    registerRoutes(app);
    app.use((_req, res) => {
        res.status(404).json({ error: "Not found" });
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err, _req, res, _next) => {
        // Keep error responses stable for the UI; log full details server-side.
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    });
    return app;
}
//# sourceMappingURL=app.js.map