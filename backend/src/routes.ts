import type { Express, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "./db/prisma.js";
import { aiQueue } from "./queues/aiQueue.js";
import { projectsService } from "./services/projectsService.js";
import { adrsService } from "./services/adrsService.js";

export function registerRoutes(app: Express) {
  app.get("/health", async (_req: Request, res: Response) => {
    const health: {
      status: "ok" | "degraded";
      db: "ok" | "down";
      redis: "ok" | "down";
    } = { status: "ok", db: "ok", redis: "ok" };

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      health.db = "down";
      health.status = "degraded";
    }

    try {
      await aiQueue.getJobCounts();
    } catch {
      health.redis = "down";
      health.status = "degraded";
    }

    res.status(health.status === "ok" ? 200 : 503).json(health);
  });

  app.get("/api/projects", async (_req: Request, res: Response) => {
    const projects = await projectsService.listProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const project = await projectsService.createProject(parsed.data);
    return res.status(201).json(project);
  });

  app.get(
    "/api/projects/:projectId/adrs",
    async (req: Request, res: Response) => {
      const params = z
        .object({ projectId: z.string().uuid() })
        .safeParse(req.params);
      if (!params.success) {
        return res.status(400).json({ error: params.error.flatten() });
      }

      const project = await projectsService.getProject(params.data.projectId);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const adrs = await adrsService.listProjectAdrs(params.data.projectId);
      return res.json(adrs);
    },
  );

  app.get("/api/adrs/:adrId", async (req: Request, res: Response) => {
    const params = z.object({ adrId: z.string().uuid() }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: params.error.flatten() });
    }

    const adr = await adrsService.getAdr(params.data.adrId);
    if (!adr) return res.status(404).json({ error: "ADR not found" });
    return res.json(adr);
  });

  app.post(
    "/api/projects/:projectId/adrs/draft",
    async (req: Request, res: Response) => {
      const params = z
        .object({ projectId: z.string().uuid() })
        .safeParse(req.params);
      if (!params.success) {
        return res.status(400).json({ error: params.error.flatten() });
      }

      const schema = z.object({
        title: z.string().min(5),
        context: z.string().min(20),
        options: z.array(z.string().min(1)).min(1),
        preferredOption: z.string().min(1).optional(),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const adr = await adrsService.createAdrDraftJob(params.data.projectId, {
        title: parsed.data.title,
        context: parsed.data.context,
        options: parsed.data.options,
        ...(parsed.data.preferredOption
          ? { preferredOption: parsed.data.preferredOption }
          : {}),
      });

      if (!adr) return res.status(404).json({ error: "Project not found" });
      return res.status(201).json(adr);
    },
  );

  app.post("/api/adrs/:adrId/reviews", async (req: Request, res: Response) => {
    const params = z.object({ adrId: z.string().uuid() }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: params.error.flatten() });
    }

    const review = await adrsService.createAdrReviewJob(params.data.adrId);
    if (!review) {
      return res.status(400).json({
        error: "ADR not found or not ready yet. Wait for generation to complete.",
      });
    }
    return res.status(201).json(review);
  });

  app.get("/api/reviews/:reviewId", async (req: Request, res: Response) => {
    const params = z
      .object({ reviewId: z.string().uuid() })
      .safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: params.error.flatten() });
    }

    const review = await adrsService.getReview(params.data.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    return res.json(review);
  });

  app.post(
    "/api/projects/:projectId/health-checks",
    async (req: Request, res: Response) => {
      const params = z
        .object({ projectId: z.string().uuid() })
        .safeParse(req.params);
      if (!params.success) {
        return res.status(400).json({ error: params.error.flatten() });
      }

      const healthCheck = await adrsService.createProjectHealthCheckJob(
        params.data.projectId,
      );
      if (!healthCheck) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.status(201).json(healthCheck);
    },
  );

  app.get(
    "/api/projects/:projectId/health-checks/latest",
    async (req: Request, res: Response) => {
      const params = z
        .object({ projectId: z.string().uuid() })
        .safeParse(req.params);
      if (!params.success) {
        return res.status(400).json({ error: params.error.flatten() });
      }

      const healthCheck = await adrsService.getLatestHealthCheck(
        params.data.projectId,
      );
      if (!healthCheck) return res.status(404).json({ error: "Not found" });
      return res.json(healthCheck);
    },
  );

  app.get(
    "/api/health-checks/:healthCheckId",
    async (req: Request, res: Response) => {
      const params = z
        .object({ healthCheckId: z.string().uuid() })
        .safeParse(req.params);
      if (!params.success) {
        return res.status(400).json({ error: params.error.flatten() });
      }

      const healthCheck = await adrsService.getHealthCheck(
        params.data.healthCheckId,
      );
      if (!healthCheck) return res.status(404).json({ error: "Not found" });
      return res.json(healthCheck);
    },
  );
}
