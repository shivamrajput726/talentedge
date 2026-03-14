import OpenAI from "openai";
import { env } from "../env.js";

type Project = {
  id: string;
  name: string;
  description: string;
};

export type AdrDraftInput = {
  project: Project;
  title: string;
  context: string;
  options: string[];
  preferredOption?: string;
};

export type AdrDraft = {
  title: string;
  status: string;
  context: string;
  decision: string;
  consequences: string;
};

export type AdrReview = {
  summary: string;
  strengths: string[];
  risks: string[];
  suggestedImprovements: string[];
};

export type ProjectHealthCheck = {
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

function getOpenAIClient(): OpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

function stubDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const aiService = {
  async generateAdrDraft(input: AdrDraftInput): Promise<AdrDraft> {
    if (env.AI_PROVIDER === "stub") {
      await stubDelay(700);
      return {
        title: input.title,
        status: "Proposed",
        context: input.context,
        decision: `We will adopt ${input.preferredOption ?? input.options[0] ?? "the preferred option"} for ${input.project.name}.`,
        consequences:
          "- Clear owner and rollout plan required.\n- Define success metrics.\n- Add observability and a rollback strategy.\n- Revisit this decision after the next milestone.",
      };
    }

    const prompt = [
      `Project: ${input.project.name}`,
      `Project description: ${input.project.description}`,
      ``,
      `ADR title: ${input.title}`,
      ``,
      `Context:`,
      input.context,
      ``,
      `Options being considered:`,
      ...input.options.map((o, idx) => `${idx + 1}. ${o}`),
      ``,
      input.preferredOption
        ? `The team is leaning towards: ${input.preferredOption}`
        : `The team does not yet have a preferred option.`,
      ``,
      `Write a concise ADR in Markdown with sections:`,
      `# Title`,
      `## Status`,
      `## Context`,
      `## Decision`,
      `## Consequences`,
      ``,
      `Be specific and pragmatic. Write for future engineers.`,
    ].join("\n");

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      instructions:
        "You are an experienced software architect helping a team capture high-quality Architecture Decision Records (ADRs).",
      input: prompt,
    });

    const text = response.output_text ?? "";
    const sections = extractMarkdownSections(text);

    return {
      title: sections.Title?.trim() || input.title,
      status: sections.Status?.trim() || "Proposed",
      context: sections.Context?.trim() || input.context,
      decision: (sections.Decision ?? "").trim(),
      consequences: (sections.Consequences ?? "").trim(),
    };
  },

  async reviewAdr(adrText: string): Promise<AdrReview> {
    if (env.AI_PROVIDER === "stub") {
      await stubDelay(500);
      return {
        summary:
          "Clear ADR structure with a reasonable decision, but it could use tighter success criteria and a rollback plan.",
        strengths: ["Well-scoped decision", "Context is understandable"],
        risks: ["Missing measurable acceptance criteria", "No explicit rollback"],
        suggestedImprovements: [
          "Add success metrics and SLO impact.",
          "Include rollout phases and rollback triggers.",
        ],
      };
    }

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      instructions:
        "You are an experienced software architect reviewing an Architecture Decision Record (ADR).",
      input: [
        `ADR content (Markdown):`,
        adrText,
        ``,
        `Provide concrete, actionable feedback.`,
      ].join("\n"),
      text: {
        format: {
          type: "json_schema",
          name: "AdrReview",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              risks: { type: "array", items: { type: "string" } },
              suggestedImprovements: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["summary", "strengths", "risks", "suggestedImprovements"],
          },
        },
      },
    });

    const jsonText = response.output_text ?? "{}";
    return JSON.parse(jsonText) as AdrReview;
  },

  async runProjectHealthCheck(input: {
    project: Project;
    adrs: Array<{
      id: string;
      title: string;
      status: string;
      decision: string;
      consequences: string;
    }>;
  }): Promise<ProjectHealthCheck> {
    if (env.AI_PROVIDER === "stub") {
      await stubDelay(800);
      return {
        summary:
          "Healthy foundation. Biggest gaps: explicit security ADR and observability decision.",
        keyDecisions: input.adrs.slice(0, 3).map((a) => ({
          adrId: a.id,
          title: a.title,
          status: a.status,
          decision: a.decision || "(Decision pending)",
        })),
        contradictions: [],
        risks: ["Unclear authn/authz strategy", "No documented rollback policy"],
        missingAdrs: ["Authentication/Authorization approach", "Observability (logs/metrics/traces)", "Secrets management"],
        nextSteps: ["Create ADRs for the missing topics", "Add acceptance criteria to existing ADRs"],
      };
    }

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      instructions:
        "You are a principal engineer doing a pragmatic architecture review. You identify contradictions, missing decisions, and next steps.",
      input: [
        `Project: ${input.project.name}`,
        `Description: ${input.project.description}`,
        ``,
        `ADRs (condensed):`,
        ...input.adrs.map((a) =>
          [
            `- id: ${a.id}`,
            `  title: ${a.title}`,
            `  status: ${a.status}`,
            `  decision: ${a.decision}`,
            `  consequences: ${a.consequences}`,
          ].join("\n"),
        ),
        ``,
        `Return a JSON object with the required schema.`,
      ].join("\n"),
      text: {
        format: {
          type: "json_schema",
          name: "ProjectHealthCheck",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              keyDecisions: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    adrId: { type: "string" },
                    title: { type: "string" },
                    status: { type: "string" },
                    decision: { type: "string" },
                  },
                  required: ["adrId", "title", "status", "decision"],
                },
              },
              contradictions: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    description: { type: "string" },
                    relatedAdrIds: { type: "array", items: { type: "string" } },
                  },
                  required: ["description", "relatedAdrIds"],
                },
              },
              risks: { type: "array", items: { type: "string" } },
              missingAdrs: { type: "array", items: { type: "string" } },
              nextSteps: { type: "array", items: { type: "string" } },
            },
            required: [
              "summary",
              "keyDecisions",
              "contradictions",
              "risks",
              "missingAdrs",
              "nextSteps",
            ],
          },
        },
      },
    });

    const jsonText = response.output_text ?? "{}";
    return JSON.parse(jsonText) as ProjectHealthCheck;
  },
};

function extractMarkdownSections(
  markdown: string,
): Record<string, string | undefined> {
  const lines = markdown.split("\n");
  const sections: Record<string, string> = {};

  let current: string | null = null;
  for (const line of lines) {
    const match = /^#+\s*(.+)$/.exec(line.trim());
    if (match) {
      current = match[1]?.trim() ?? null;
      if (current && !sections[current]) {
        sections[current] = "";
      }
      continue;
    }
    if (current) {
      sections[current] += (sections[current] ? "\n" : "") + line;
    }
  }

  return sections;
}

