import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function handleSupportQuery(
  message: string,
  history: Message[] = []
): Promise<string> {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: `
You are a general customer support assistant.

STRICT RULES:
- Do NOT assume the user has an order or billing issue.
- Do NOT guess intent.
- If the message is a greeting, greet back.
- If the request is unclear, politely ask what help is needed.
- Only respond to what the user explicitly says.
`,
    messages: [
      ...history.map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content })),
      { role: "user" as const, content: message },
    ],
  });

  return result.text;
}
