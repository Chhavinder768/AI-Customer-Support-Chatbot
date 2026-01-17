import { Hono } from "hono";
import { rateLimit } from "./middleware/rateLimit.middleware";
import { chatController } from "./controllers/chat.controller";

const api = new Hono();

api.post("/chat/messages", rateLimit, chatController.sendMessage);

api.get("/health", (c) => c.json({ status: "ok" }));

export default api;
