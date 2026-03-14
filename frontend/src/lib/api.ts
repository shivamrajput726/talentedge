import type { Adr, AdrReview, Project, ProjectHealthCheck } from "../types";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== ""
    ? import.meta.env.VITE_API_BASE_URL
    : "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API error ${res.status}: ${res.statusText || text || "Unknown error"}`,
    );
  }

  return (await res.json()) as T;
}

export const api = {
  getHealth() {
    return request<{ status: "ok" | "degraded"; db: string; redis: string }>(
      "/health",
    );
  },

  listProjects() {
    return request<Project[]>("/api/projects");
  },

  createProject(input: { name: string; description: string }) {
    return request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getProjectAdrs(projectId: string) {
    return request<Adr[]>(`/api/projects/${projectId}/adrs`);
  },

  generateAdrDraft(projectId: string, input: {
    title: string;
    context: string;
    options: string[];
    preferredOption?: string;
  }) {
    return request<Adr>(`/api/projects/${projectId}/adrs/draft`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getAdr(adrId: string) {
    return request<Adr>(`/api/adrs/${adrId}`);
  },

  requestAdrReview(adrId: string) {
    return request<AdrReview>(`/api/adrs/${adrId}/reviews`, {
      method: "POST",
    });
  },

  getReview(reviewId: string) {
    return request<AdrReview>(`/api/reviews/${reviewId}`);
  },

  runProjectHealthCheck(projectId: string) {
    return request<ProjectHealthCheck>(`/api/projects/${projectId}/health-checks`, {
      method: "POST",
    });
  },

  getLatestProjectHealthCheck(projectId: string) {
    return request<ProjectHealthCheck>(
      `/api/projects/${projectId}/health-checks/latest`,
    );
  },

  getHealthCheck(healthCheckId: string) {
    return request<ProjectHealthCheck>(`/api/health-checks/${healthCheckId}`);
  },
};
