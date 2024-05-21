import { NextResponse } from "next/server";
import { createCustomerPortal } from "@/libs/stripe";

export async function POST(req) {

    try {
          
      const body = await req.json();

      if (!body.returnUrl) {
        return NextResponse.json(
          { error: "Return URL is required" },
          { status: 400 }
        );
      }

      const stripePortalUrl = await createCustomerPortal({
        customerId: body.customerId,
        returnUrl: body.returnUrl,
      });

      return NextResponse.json({
        url: stripePortalUrl,
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e?.message }, { status: 500 });
    }
}
