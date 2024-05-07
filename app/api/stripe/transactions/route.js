import { NextResponse } from "next/server";
import Stripe from 'stripe';

// This route serves minified JavaScript code to clients

const stripe = new Stripe(process.env.STRIPE_RESTRICTED_API_KEY);

export async function GET(req) {

  try {
    const charges = await stripe.charges.list({ limit: 15, paid: true });
    const transactionData = charges.data.map(charge => ({
      message: `Someone in ${charge.billing_details.address.country} subscribed`,
      timeAgo: charge.created, // You'll convert this on client-side to "time ago" format
      verified: charge.paid,
    }));

    const response = NextResponse.json(transactionData);
    response.headers.set('Access-Control-Allow-Origin', '*'); // Allow only from localhost:3001
    response.headers.set('Content-Type', 'application/json'); // Ensure correct Content-Type header
    return response;
  } catch (error) {
    console.error('Error fetching transactions from Stripe:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch transactions' }), { status: 500 });
  }
}
