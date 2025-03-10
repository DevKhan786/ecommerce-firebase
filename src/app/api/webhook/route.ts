// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe/config";
import {} from "firebase/firestore";

import { createOrderAdmin } from "@/lib/firebase/adminDb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const body = await request.text();

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { message: "No signature provided" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { message: "Webhook secret is not set" },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("Processing payment intent:", paymentIntent.id);

    try {
      await createOrderAdmin({
        userId: paymentIntent.metadata?.userId || "guest",
        items: [],
        totalAmount: paymentIntent.amount / 100,
        status: "processing",
        shippingAddress: {},
        paymentIntentId: paymentIntent.id,
      });
      console.log("Order created successfully for payment:", paymentIntent.id);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  }

  return NextResponse.json({ received: true });
}
