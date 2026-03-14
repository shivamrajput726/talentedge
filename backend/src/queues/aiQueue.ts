import { Queue } from "bullmq";
import { env } from "../env.js";
import type { ConnectionOptions } from "bullmq";

export const AI_QUEUE_NAME = "ai";

function parseRedisUrl(redisUrl: string): ConnectionOptions {
  const url = new URL(redisUrl);
  if (url.protocol !== "redis:" && url.protocol !== "rediss:") {
    throw new Error(
      `Invalid REDIS_URL protocol: ${url.protocol}. Expected redis: or rediss:.`,
    );
  }

  const port = url.port ? Number(url.port) : 6379;
  const username = url.username ? decodeURIComponent(url.username) : undefined;
  const password = url.password ? decodeURIComponent(url.password) : undefined;

  return {
    host: url.hostname,
    port,
    username,
    password,
    // For rediss://, BullMQ/ioredis will use TLS when tls is set.
    ...(url.protocol === "rediss:" ? { tls: {} } : {}),
  };
}

export const redisConnection = parseRedisUrl(env.REDIS_URL);

export const aiQueue = new Queue(AI_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
});
