import "dotenv/config";
import { createApp } from "./app.js";
import { env } from "./env.js";
const app = createApp();
app.listen(env.PORT, () => {
    console.log(`ADR Forge API listening on port ${env.PORT}`);
});
//# sourceMappingURL=server.js.map