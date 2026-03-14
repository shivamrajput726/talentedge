process.env.NODE_ENV ??= "test";
process.env.LOG_LEVEL ??= "silent";

// Keep tests hermetic; these values don't need to point to live services.
process.env.DATABASE_URL ??=
  "postgresql://postgres:postgres@localhost:5432/adrforge_test?schema=public";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.FRONTEND_ORIGIN ??= "*";

// Ensure AI code paths don't require external credentials.
process.env.AI_PROVIDER ??= "stub";
process.env.OPENAI_MODEL ??= "gpt-5-mini";

