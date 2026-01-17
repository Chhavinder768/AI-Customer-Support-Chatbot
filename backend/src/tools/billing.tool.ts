import { prisma } from "../db/prisma";

export async function getPaymentByOrderId(orderId: string) {
  return prisma.payment.findFirst({
    where: { orderId },
  });
}
