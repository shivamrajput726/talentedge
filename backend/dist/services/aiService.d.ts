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
export declare const aiService: {
    generateAdrDraft(input: AdrDraftInput): Promise<AdrDraft>;
    reviewAdr(adrText: string): Promise<AdrReview>;
    runProjectHealthCheck(input: {
        project: Project;
        adrs: Array<{
            id: string;
            title: string;
            status: string;
            decision: string;
            consequences: string;
        }>;
    }): Promise<ProjectHealthCheck>;
};
export {};
//# sourceMappingURL=aiService.d.ts.map