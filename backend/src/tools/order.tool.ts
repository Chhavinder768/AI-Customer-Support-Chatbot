import { prisma } from "../db/prisma";

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
  });
}
