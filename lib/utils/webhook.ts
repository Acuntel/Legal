import { prisma } from "@/lib/db/prisma";

export async function dispatchWebhook(
  firmId: string,
  event: string,
  data: Record<string, unknown>,
) {
  const webhooks = await prisma.webhook.findMany({
    where: { firmId, isActive: true, events: { has: event } },
  });

  await Promise.allSettled(
    webhooks.map((wh) =>
      fetch(wh.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": wh.secret,
          "X-Event": event,
        },
        body: JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString(),
        }),
      }),
    ),
  );
}
