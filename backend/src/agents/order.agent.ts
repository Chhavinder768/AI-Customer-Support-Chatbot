import { getOrderById } from "../tools/order.tool";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function handleOrderQuery(
  message: string,
  history: Message[] = []
): Promise<string> {
  // Check if order ID was already provided in history
  let orderId = null;
  
  // First, try to extract from current message
  const orderIdMatch = message.match(/ORD_\d+/i);
  if (orderIdMatch) {
    orderId = orderIdMatch[0];
  } else {
    // Search history for order ID
    for (const msg of history) {
      const match = msg.content.match(/ORD_\d+/i);
      if (match) {
        orderId = match[0];
        break;
      }
    }
  }

  if (!orderId) {
    return "Please provide your order ID (example: ORD_002).";
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return `No order found with ID ${orderId}.`;
  }

  const context = `
Order ID: ${order.id}
Status: ${order.status}
Tracking: ${order.tracking ?? "Not available"}
`;

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: `
You are an Order Support Agent.

Rules:
- NEVER ask for the order ID again if already provided.
- Use ONLY the order context.
- If the order is delivered, ask if the user wants a return or refund.
- Do NOT repeat greetings or reset the conversation.
- Do NOT repeat the same question multiple times.

Goal:
Resolve order-related issues efficiently.
`,
    messages: [
      { role: "system", content: context },
      ...history.map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content })),
      { role: "user" as const, content: message },
    ],
  });

  return result.text;
}
