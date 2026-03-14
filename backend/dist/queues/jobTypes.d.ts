export type GenerateAdrJob = {
    type: "generateAdr";
    adrId: string;
};
export type ReviewAdrJob = {
    type: "reviewAdr";
    reviewId: string;
};
export type ProjectHealthCheckJob = {
    type: "projectHealthCheck";
    healthCheckId: string;
};
export type AiJob = GenerateAdrJob | ReviewAdrJob | ProjectHealthCheckJob;
//# sourceMappingURL=jobTypes.d.ts.map