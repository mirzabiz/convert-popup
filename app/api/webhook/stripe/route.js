import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { findCheckoutSession } from "@/libs/stripe";
import { dbAdmin } from '../../../../libs/firebaseAdminSdk'; // Ensure this path is correct
import admin from 'firebase-admin';
import config from "@/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;


export async function POST(req) {

  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product

        const session = await findCheckoutSession(data.object.id);
        if (!session) {
            console.error("Session not found or failed to retrieve.");
            break;
        }

        // Extract necessary details
        // const { customer, customer_email } = session;

        const customerId = session?.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const customer_email = customer.email
        const clientReferenceId = data.object.client_reference_id || session.metadata.uid;

        await stripe.subscriptions.update(session.subscription.id, {
          metadata: {
            uid: clientReferenceId,
          },
        }).catch((e) => console.log(e));
        // Call the helper function to update Firestore
        await updateUserInFirestore(clientReferenceId, customer_email, session, customerId);

        console.log("Session processed and Firestore updated.");

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail({to: ...});
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        const subscriptionStatus = data.object.status;
        const clientReferenceId =  data.object.metadata.uid;
        const customerId = data.object.customer;

        const planId = data.object.plan.id;
        let planName;
        if (planId === config.stripe.plans[0].priceId) {
          planName = 'Starter';
        } else if (planId === config.stripe.plans[1].priceId) {
          planName = 'Pro';
        } else {
          planName = 'Unknown Plan';
        }

        const priceId = planId;
        const originalAmount = data.object.plan.amount;
        const discountAmount = data.object.discount ? data.object.discount.coupon.amount_off : 0;
        const amount = originalAmount - discountAmount;
        

        if (['canceled', 'unpaid', 'past_due'].includes(subscriptionStatus)) {
            await updateUserStatus(clientReferenceId, false, planName, priceId, amount, customerId);
            console.log(`Subscription status updated to inactive for customer: ${clientReferenceId}`);
        } else {
            await updateUserStatus(clientReferenceId, true, planName, priceId, amount, customerId);
            console.log(`Subscription status updated to active for customer: ${clientReferenceId}, ${planName, priceId, amount, customerId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        const subscriptionId = data.object.id;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userRef = dbAdmin.collection('users').doc(subscription.customer);

        const userDoc = await userRef.get();

        if (userDoc.exists) {
            await userRef.set({
                hasAccess: false,
                subscriptionStatus: 'inactive'
            }, { merge: true });
            console.log("Subscription deleted and access revoked for customer:", subscription.customer);
        } else {
            console.log("No user found with the given customer ID from the subscription:", subscription.customer);
        }

        break;
      }

      case "invoice.paid": {
        console.log('💸 INVOICE: invoice.paid')
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const clientReferenceId = data.object.metadata.uid;
        const customerId = data.object.customer;

        const lineItem = data.object.lines.data[0];
        const priceId = lineItem.price.id;

        const planId = priceId;
        let planName;
        if (planId === config.stripe.plans[0].priceId) {
          planName = 'Starter';
        } else if (planId === config.stripe.plans[1].priceId) {
          planName = 'Pro';
        } else {
          planName = 'Unknown Plan';
        }
        const originalAmount = lineItem.price.unit_amount;
        const discountAmount = data.object.discount ? data.object.discount.coupon.amount_off : 0;
        const amount = originalAmount - discountAmount;

        console.log('💰 INVOICE obj plnaName:',planName, lineItem.price )
        if (!clientReferenceId) {
          console.error("clientReferenceId is missing or invalid.");
          break;
        }
        await updateAccessOnInvoicePaid(clientReferenceId, priceId, planName, amount, customerId);

        break;
      }

      case "invoice.payment_failed": {
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        const clientReferenceId =  data.object.metadata.uid;

        const userRef = dbAdmin.collection('users').doc(clientReferenceId);
        const docSnapshot = await userRef.get();

        if (docSnapshot.exists) {
            // You may decide to set access to false immediately or after retry attempts fail
            await userRef.set({
                hasAccess: false,
                paymentStatus: 'failed' // Tracking payment status
            }, { merge: true });
            console.log("Access revoked due to payment failure for customer:", clientReferenceId);
        } else {
            console.log("No record found for customer ID:", clientReferenceId);
        }
        break;
      }
      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: " + e.message + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
async function updateUserInFirestore(uid, email, session, customerId) {
    const usersRef = dbAdmin.collection('users');
    const userDoc = usersRef.doc(uid);

    const planId = session?.line_items?.data[0]?.price.id;
    let planName;
    if (planId === config.stripe.plans[0].priceId) {
        planName = 'Starter';
    } else if (planId === config.stripe.plans[1].priceId) {
        planName = 'Pro';
    } else {
        planName = 'Unknown Plan';
    }


    const userData = {
        planName,
        email: email,
        hasAccess: true, 
        lastSession: session.id,
        subscriptionStatus: session.subscription ? 'subscribed' : 'inactive',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        price: (session?.amount_total / 100).toFixed(2),
        priceId: session?.line_items?.data[0]?.price.id, 
        customerId: customerId
    };
    await userDoc.set(userData, { merge: true });
    console.log("Firestore updated for user:", uid);
}

async function updateAccessOnInvoicePaid(uid, priceId, planName, amount, customerId) {
    const usersRef = dbAdmin.collection('users');
    const userDoc = usersRef.doc(uid);
    const docSnapshot = await userDoc.get();


    if (!docSnapshot.exists) {
        console.log("User not found in Firestore");
        return;
    }

    const user = docSnapshot.data();

    // Check if the paid invoice corresponds to the priceId the user has subscribed to
    if (user.priceId === priceId) {
        const userData = {
            hasAccess: true, // Reinstate or continue access
            lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(), // Record the last payment date
            subscriptionStatus: 'subscribed'
        };
        if (planName && user.planName !== planName) {
            userData.planName = planName;
        }
        if (amount && user.amount !== amount) {
            userData.price = (amount / 100).toFixed(2);
        }
        if (customerId) {
          userData.customerId = customerId;
        }
        await userDoc.set(userData, { merge: true });
        console.log("Access granted and user details updated in Firestore for user:", uid);
    } else {
        console.log("Invoice price does not match user's subscribed price, no update made.");
    }
}

async function updateUserStatus(uid, status, planName, priceId, amount, customerId) {
    const usersRef = dbAdmin.collection('users');
    const userDoc = usersRef.doc(uid);
    const docSnapshot = await userDoc.get();

    if (!docSnapshot.exists) {
      console.log("User not found in Firestore");
      return;
  }

  const user = docSnapshot.data();

  const userData = {
      hasAccess: status,
      subscriptionStatus: status ? 'subscribed' : 'inactive'
  };
  if (planName && user.planName !== planName) {
      userData.planName = planName;
  }
  if (priceId && user.priceId !== priceId) {
      userData.priceId = priceId;
  }
  if (amount && user.amount !== amount) {
      userData.price = (amount / 100).toFixed(2); // Convert amount to dollars
  }
  if (customerId) {
    userData.customerId = customerId;
  }
  await userDoc.set(userData, { merge: true });
  console.log(`User status updated to ${status} for customer ID: ${uid}`);
}
// async function createUserWithEmail(email) {
//     try {
//         const userRecord = await adminAuth.createUser({
//             email: email,
//             emailVerified: false,
//         });

//         console.log('firebase email', email)
//         // Send email for password reset or account finalization
//         await adminAuth.generatePasswordResetLink(email, {
//             // Specify the URL you want the user to be redirected to after password reset
//             url: 'http://localhost:3000/home',
//         }).then(link => {
//             // Here, send the link via email to the user
//             console.log(`Send this link via email to the user: ${link}`);
//         });
        
//         await sendPasswordResetEmail(adminAuth, email);

//         console.log(`User created with UID: ${userRecord.uid}`);
//     } catch (error) {
//         console.error("Failed to create user and send email:", error);
//     }
// }
