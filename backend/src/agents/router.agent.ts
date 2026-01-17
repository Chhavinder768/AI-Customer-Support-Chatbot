import { handleSupportQuery } from "./support.agent";
import { handleOrderQuery } from "./order.agent";
import { handleBillingQuery } from "./billing.agent";

export type AgentType = "support" | "order" | "billing";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function routeMessage(
  message: string,
  activeAgent?: AgentType,
  history: Message[] = []
): Promise<{ reply: string; agent: AgentType }> {
  const text = message.toLowerCase();

  // 🔥 STRONG INTENT DETECTION (ALWAYS OVERRIDES)
  const isOrderIntent =
    text.includes("order") ||
    text.includes("track") ||
    text.includes("delivery") ||
    text.includes("return") ||
    text.includes("refund") ||
    text.match(/ord_\d+/i);

  const isBillingIntent =
    text.includes("payment") ||
    text.includes("invoice") ||
    text.includes("billing");
  const isGreeting =
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text === "good morning" ||
    text === "good evening";

  if (isGreeting) {
    return {
      reply: await handleSupportQuery(message, history),
      agent: "support",
    };
  }
  // 1️⃣ Explicit override
  if (isOrderIntent) {
    return {
      reply: await handleOrderQuery(message, history),
      agent: "order",
    };
  }

  if (isBillingIntent) {
    return {
      reply: await handleBillingQuery(message, history),
      agent: "billing",
    };
  }

  // 2️⃣ Continue active agent ONLY if no new intent
  if (activeAgent === "order") {
    return {
      reply: await handleOrderQuery(message, history),
      agent: "order",
    };
  }

  if (activeAgent === "billing") {
    return {
      reply: await handleBillingQuery(message, history),
      agent: "billing",
    };
  }

  // 3️⃣ Fallback
  return {
    reply: await handleSupportQuery(message, history),
    agent: "support",
  };
}
