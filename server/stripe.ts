import { Router, raw } from "express";
import Stripe from "stripe";
import pool from "./db";

const router = Router();

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-04-30.basil" as any });
}

function getBaseUrl(req: any): string {
  const proto = req.header("x-forwarded-proto") || req.protocol || "https";
  const host = req.header("x-forwarded-host") || req.get("host");
  return `${proto}://${host}`;
}

router.post("/subscribe/repair", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Login required" });
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ message: "Payment system not configured" });
  }

  try {
    const userResult = await pool.query("SELECT email, stripe_customer_id FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: String(userId) },
      });
      customerId = customer.id;
      await pool.query("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", [customerId, userId]);
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sireen Repair Mode",
              description: "Monthly access to all 18 credit repair missions",
            },
            unit_amount: 1499,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success/repair?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/upgrade`,
      metadata: { userId: String(userId), product: "repair" },
      subscription_data: {
        metadata: { userId: String(userId), product: "repair" },
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
});

router.post("/subscribe/letters", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Login required" });
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ message: "Payment system not configured" });
  }

  try {
    const userResult = await pool.query("SELECT email, stripe_customer_id FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: String(userId) },
      });
      customerId = customer.id;
      await pool.query("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", [customerId, userId]);
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sireen Dispute Packet",
              description: "15 professional dispute letter templates",
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success/letters?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/letters`,
      metadata: { userId: String(userId), product: "letters" },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe letters checkout error:", err);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
});

router.get("/subscription/status", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const result = await pool.query(
      "SELECT is_premium, premium_expires_at, has_letters, subscription_status, stripe_subscription_id FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    let isPremium = user.is_premium;

    if (isPremium && user.premium_expires_at) {
      if (new Date(user.premium_expires_at).getTime() < Date.now()) {
        isPremium = false;
        await pool.query(
          "UPDATE users SET is_premium = false, subscription_status = 'expired' WHERE id = $1",
          [userId]
        );
      }
    }

    return res.json({
      isPremium,
      premiumExpiresAt: user.premium_expires_at,
      hasLetters: user.has_letters,
      subscriptionStatus: user.subscription_status,
      hasSubscription: !!user.stripe_subscription_id,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    return res.status(500).json({ message: "Failed to fetch status" });
  }
});

export function setupWebhookRoute(app: any) {
  app.post("/api/webhooks/stripe", raw({ type: "application/json" }), async (req: any, res: any) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).send("Payment system not configured");
    }

    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      if (webhookSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else if (process.env.NODE_ENV !== "production") {
        event = JSON.parse(req.body.toString()) as Stripe.Event;
        console.warn("WARNING: Webhook signature verification skipped — set STRIPE_WEBHOOK_SECRET");
      } else {
        console.error("STRIPE_WEBHOOK_SECRET not set in production — rejecting webhook");
        return res.status(500).send("Webhook configuration error");
      }
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const product = session.metadata?.product;

          if (!userId) break;

          if (product === "repair" && session.subscription) {
            let expiresAt: string;
            try {
              const sub = await stripe.subscriptions.retrieve(session.subscription as string);
              expiresAt = new Date((sub as any).current_period_end * 1000).toISOString();
            } catch {
              expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            }
            await pool.query(
              `UPDATE users SET is_premium = true, premium_expires_at = $1, stripe_subscription_id = $2, subscription_status = 'active', updated_at = NOW() WHERE id = $3`,
              [expiresAt, session.subscription, userId]
            );
            console.log(`Premium activated for user ${userId}`);
          }

          if (product === "letters") {
            await pool.query(
              `UPDATE users SET has_letters = true, updated_at = NOW() WHERE id = $1`,
              [userId]
            );
            console.log(`Letters unlocked for user ${userId}`);
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = invoice.subscription as string;

          if (subscriptionId) {
            let expiresAt: string;
            try {
              const sub = await stripe.subscriptions.retrieve(subscriptionId);
              expiresAt = new Date((sub as any).current_period_end * 1000).toISOString();
            } catch {
              expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            }
            await pool.query(
              `UPDATE users SET is_premium = true, premium_expires_at = $1, subscription_status = 'active', updated_at = NOW() WHERE stripe_subscription_id = $2`,
              [expiresAt, subscriptionId]
            );
            console.log(`Subscription renewed for subscription ${subscriptionId}`);
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = invoice.subscription as string;

          if (subscriptionId) {
            await pool.query(
              `UPDATE users SET is_premium = false, subscription_status = 'past_due', updated_at = NOW() WHERE stripe_subscription_id = $1`,
              [subscriptionId]
            );
            console.log(`Payment failed for subscription ${subscriptionId}`);
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await pool.query(
            `UPDATE users SET is_premium = false, subscription_status = 'canceled', stripe_subscription_id = NULL, updated_at = NOW() WHERE stripe_subscription_id = $1`,
            [subscription.id]
          );
          console.log(`Subscription canceled: ${subscription.id}`);
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          const status = subscription.status;

          if (status === "active") {
            const periodEnd = new Date((subscription as any).current_period_end * 1000).toISOString();
            await pool.query(
              `UPDATE users SET is_premium = true, premium_expires_at = $1, subscription_status = 'active', updated_at = NOW() WHERE stripe_subscription_id = $2`,
              [periodEnd, subscription.id]
            );
          } else if (status === "past_due" || status === "unpaid") {
            await pool.query(
              `UPDATE users SET is_premium = false, subscription_status = $1, updated_at = NOW() WHERE stripe_subscription_id = $2`,
              [status, subscription.id]
            );
          }
          break;
        }
      }

      return res.json({ received: true });
    } catch (err) {
      console.error("Webhook processing error:", err);
      return res.status(500).json({ message: "Webhook processing failed" });
    }
  });
}

export default router;
