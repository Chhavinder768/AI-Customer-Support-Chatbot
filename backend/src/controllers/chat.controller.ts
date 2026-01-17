import { Context } from "hono";
import { processMessage } from "../services/chat.service";

export const chatController = {
  async sendMessage(c: Context) {
    let body;
    try {
      body = await c.req.json();
      const result = await processMessage(body);
      return c.json(result);
    } catch (error) {
      console.error("Chat error:", error);
      return c.json(
        {
          conversationId: body?.conversationId,
          reply: "Sorry, I encountered an error. Please try again.",
          agent: "support",
        },
        500
      );
    }
  },
};