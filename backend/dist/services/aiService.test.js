import { describe, expect, it } from "vitest";
import { aiService } from "./aiService.js";
describe("aiService (stub)", () => {
    it("generates an ADR draft", async () => {
        const draft = await aiService.generateAdrDraft({
            project: {
                id: "p1",
                name: "Demo Project",
                description: "A demo project used in tests.",
            },
            title: "Choose a database",
            context: "We need persistence for core entities and auditability.",
            options: ["PostgreSQL", "MongoDB"],
            preferredOption: "PostgreSQL",
        });
        expect(draft.title).toBeTruthy();
        expect(draft.status).toBeTruthy();
        expect(draft.decision).toContain("PostgreSQL");
        expect(draft.consequences).toBeTruthy();
    });
    it("reviews an ADR", async () => {
        const review = await aiService.reviewAdr("# Test ADR\n\nSome content.");
        expect(review.summary).toBeTypeOf("string");
        expect(Array.isArray(review.strengths)).toBe(true);
        expect(Array.isArray(review.risks)).toBe(true);
        expect(Array.isArray(review.suggestedImprovements)).toBe(true);
    });
});
//# sourceMappingURL=aiService.test.js.map