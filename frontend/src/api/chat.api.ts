export async function sendMessage(
  message: string,
  conversationId?: string,
  onChunk?: (text: string) => void
): Promise<{ conversationId: string; reply: string }> {
  const res = await fetch("http://localhost:3000/api/chat/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  const data = await res.json();

  return {
    conversationId: data.conversationId,
    reply: data.reply,
  };
}