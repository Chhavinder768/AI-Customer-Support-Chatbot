import { routeMessage } from "../agents/router.agent";
import {
  createConversation,
  saveMessage,
  getConversation,
  updateActiveAgent,
} from "../tools/conversation.tool";

export async function processMessage({
  message,
  conversationId,
}: {
  message: string;
  conversationId?: string;
}) {
  if (!conversationId) {
    const convo = await createConversation();
    conversationId = convo.id;
  }

  const conversation = await getConversation(conversationId);
  const history = (conversation as any).messages || [];

  await saveMessage(conversationId, "user", message);

  const { reply, agent } = await routeMessage(
    message,
    (conversation as any).activeAgent || null,
    history
  );

  await updateActiveAgent(conversationId, agent);
  await saveMessage(conversationId, "assistant", reply);

  return {
    conversationId,
    reply,
    agent,
  };
}
