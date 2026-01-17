import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (safe for local dev)
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();

  // Create conversations
  const conversation1 = await prisma.conversation.create({
    data: {
      messages: {
        create: [
          {
            role: "user",
            content: "Hi, I need help with my order",
          },
          {
            role: "assistant",
            content: "Sure, can you share your order ID?",
          },
        ],
      },
    },
  });

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      id: "ORD_001",
      status: "shipped",
      tracking: "TRK123456",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      id: "ORD_002",
      status: "delivered",
      tracking: "TRK654321",
    },
  });

  // Create payments
  await prisma.payment.create({
    data: {
      id: "PAY_001",
      orderId: order1.id,
      status: "paid",
      invoice: "INV_001.pdf",
    },
  });

  await prisma.payment.create({
    data: {
      id: "PAY_002",
      orderId: order2.id,
      status: "refunded",
      invoice: "INV_002.pdf",
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
