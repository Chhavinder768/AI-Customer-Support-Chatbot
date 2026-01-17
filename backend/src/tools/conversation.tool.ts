import { prisma } from "../db/prisma";

export async function createConversation() {
  return prisma.conversation.create({
    data: {
      activeAgent: "support",
    },
  });
}

export async function updateActiveAgent(
  conversationId: string,
  agent: "support" | "order" | "billing"
) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: { activeAgent: agent },
  });
}

export async function getConversation(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: true,
    },
  });
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  return prisma.message.create({
    data: { conversationId, role, content },
  });
}