// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe/config";
import { CartItemType } from "@/lib/types";
import { createOrderAdmin } from "@/lib/firebase/adminDb";


const getSafeImageUrl = (url: string): string => {
  if (url && url.length > 1800) {
    return "https://placehold.co/400x400?text=Product+Image";
  }
  return url;
};

export async function POST(request: NextRequest) {
  try {
    const { items, userId, shippingAddress } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Cart items are required" },
        { status: 400 }
      );
    }


    const lineItems = items.map((item: CartItemType) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [getSafeImageUrl(item.image)] : [],
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));


    const totalAmount = items.reduce(
      (sum: number, item: CartItemType) => sum + item.price * item.quantity,
      0
    );


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get(
        "origin"
      )}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/checkout/canceled`,
      metadata: {
        userId: userId || "guest",
      },
    });

   
    if (session.payment_intent) {
      await createOrderAdmin({
        userId: userId || "guest",
        items,
        totalAmount,
        status: "pending",
        shippingAddress,
        paymentIntentId: session.payment_intent as string,
      });
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { message: "Error creating checkout session", error: errorMessage },
      { status: 500 }
    );
  }
}
