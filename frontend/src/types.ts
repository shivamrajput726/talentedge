export type AiStatus = "pending" | "processing" | "ready" | "failed";

export type Adr = {
  id: string;
  projectId: string;
  title: string;
  status: string;
  context: string;
  options: string[];
  preferredOption: string | null;
  decision: string;
  consequences: string;
  aiStatus: AiStatus;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  adrs: Adr[];
};

export type AdrReview = {
  id: string;
  adrId: string;
  summary: string;
  strengths: string[];
  risks: string[];
  suggestedImprovements: string[];
  aiStatus: AiStatus;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectHealthCheckResult = {
  summary: string;
  keyDecisions: Array<{
    adrId: string;
    title: string;
    status: string;
    decision: string;
  }>;
  contradictions: Array<{
    description: string;
    relatedAdrIds: string[];
  }>;
  risks: string[];
  missingAdrs: string[];
  nextSteps: string[];
};

export type ProjectHealthCheck = {
  id: string;
  projectId: string;
  result: Partial<ProjectHealthCheckResult>;
  aiStatus: AiStatus;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};
