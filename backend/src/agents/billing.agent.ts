import { getPaymentByOrderId } from "../tools/billing.tool";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function handleBillingQuery(
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
    return "Please provide your order ID for billing queries.";
  }

  const payment = await getPaymentByOrderId(orderId);
  if (!payment) {
    return `No billing details found for ${orderId}.`;
  }

  const context = `
Order ID: ${orderId}
Payment Status: ${payment.status}
Invoice: ${payment.invoice ?? "N/A"}
`;

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: "You are a Billing Support Agent. Use only billing context. Do NOT ask for the order ID again if already provided.",
    messages: [
      { role: "system", content: context },
      ...history.map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content })),
      { role: "user" as const, content: message },
    ],
  });

  return result.text;
}
