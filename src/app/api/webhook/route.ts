// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { headers } from "next/headers";
import stripe from "@/lib/stripe/config";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { createOrderAdmin } from "@/lib/firebase/adminDb";

// Disable body parsing, need raw body for Stripe webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getOrderByPaymentIntentId(paymentIntentId: string) {
  try {
    const ordersRef = adminDb.collection("orders");
    const snapshot = await ordersRef
      .where("paymentIntentId", "==", paymentIntentId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  } catch (error) {
    console.error("Error getting order by payment intent ID:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Get the signature from the header directly without using headers()
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
  } catch (err: any) {
    return NextResponse.json(
      { message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("Processing payment intent:", paymentIntent.id);

    try {
      // Create or update order in Firestore
      await createOrderAdmin({
        userId: paymentIntent.metadata?.userId || "guest",
        items: [], // You'd need to store cart items in the session or metadata
        totalAmount: paymentIntent.amount / 100, // Convert cents to dollars
        status: "processing",
        shippingAddress: {}, // You'd need to store this in metadata
        paymentIntentId: paymentIntent.id,
      });
      console.log("Order created successfully for payment:", paymentIntent.id);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  }

  return NextResponse.json({ received: true });
}
