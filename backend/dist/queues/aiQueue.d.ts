import { Queue } from "bullmq";
import type { ConnectionOptions } from "bullmq";
export declare const AI_QUEUE_NAME = "ai";
export declare const redisConnection: ConnectionOptions;
export declare const aiQueue: Queue<any, any, string, any, any, string>;
//# sourceMappingURL=aiQueue.d.ts.map