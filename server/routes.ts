import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { answerKeys } from "./answers";
import pool from "./db";

const PREMIUM_LESSON_IDS = new Set([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
const BCU_LESSON_IDS = new Set([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]);

export async function registerRoutes(app: Express): Promise<Server> {
  const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey) {
    console.warn("STRIPE_PUBLISHABLE_KEY not set — checkout pages will not function");
  }

  app.post("/api/grade-quiz", async (req, res) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const { lessonId, answers } = req.body as {
      lessonId: number;
      answers: string[];
    };

    if (
      !lessonId ||
      typeof lessonId !== "number" ||
      !Number.isInteger(lessonId) ||
      lessonId < 1 ||
      !Array.isArray(answers) ||
      answers.length === 0 ||
      answers.length > 10 ||
      !answers.every((a) => typeof a === "string" && a.length < 500)
    ) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    if (PREMIUM_LESSON_IDS.has(lessonId) || BCU_LESSON_IDS.has(lessonId)) {
      try {
        const userResult = await pool.query(
          "SELECT is_premium, has_university FROM users WHERE id = $1",
          [userId]
        );
        if (userResult.rows.length === 0) {
          return res.status(401).json({ message: "User not found" });
        }
        const user = userResult.rows[0];

        if (PREMIUM_LESSON_IDS.has(lessonId) && !user.is_premium) {
          return res.status(403).json({ message: "Premium subscription required" });
        }
        if (BCU_LESSON_IDS.has(lessonId) && !user.has_university) {
          return res.status(403).json({ message: "University access required" });
        }
      } catch (err) {
        console.error("Entitlement check error:", err);
        return res.status(500).json({ message: "Server error" });
      }
    }

    const key = answerKeys[lessonId];
    if (!key) {
      return res.status(404).json({ message: "Answer key not found for this lesson" });
    }

    if (answers.length !== key.length) {
      return res.status(400).json({ message: `Expected ${key.length} answers, received ${answers.length}` });
    }

    const correct = answers.map((ans, i) => {
      const expected = key[i];
      return (
        typeof expected === "string" &&
        ans.trim().toLowerCase() === expected.trim().toLowerCase()
      );
    });

    const score = Math.round((correct.filter(Boolean).length / key.length) * 100);
    const passed = score >= 80;
    const xpEarned = passed ? (score === 100 ? 100 : score >= 90 ? 75 : 50) : 0;

    return res.json({ score, passed, correct, xpEarned });
  });

  app.get("/repair-checkout", (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sireen Repair Mode — Checkout</title>
  <style>${checkoutPageStyles}</style>
</head>
<body>
  <h1>SIREEN REPAIR MODE</h1>
  <p class="subtitle">Unlock All 18 Missions &amp; Full Credit Repair System</p>
  <script async src="https://js.stripe.com/v3/buy-button.js"></script>
  <stripe-buy-button
    buy-button-id="buy_btn_1T8W1d43frjv7jhdxZLMhEBc"
    publishable-key="${stripeKey}"
  ></stripe-buy-button>
  <p class="secure">Secure checkout powered by Stripe</p>
</body>
</html>`);
  });

  app.get("/letters-checkout", (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sireen Dispute Packet — Checkout</title>
  <style>${checkoutPageStyles}</style>
</head>
<body>
  <h1>SIREEN DISPUTE PACKET</h1>
  <p class="subtitle">15 Professional Dispute Letter Templates</p>
  <div class="checkout-price">$50.00</div>
  <script async src="https://js.stripe.com/v3/buy-button.js"></script>
  <stripe-buy-button
    buy-button-id="buy_btn_1T8Vx943frjv7jhdhEHUvKij"
    publishable-key="${stripeKey}"
  ></stripe-buy-button>
  <p class="secure">Secure checkout powered by Stripe</p>
</body>
</html>`);
  });

  async function verifyStripeSession(req: any, res: any): Promise<any | null> {
    const sessionId = req.query.session_id as string;
    if (!sessionId || typeof sessionId !== "string") {
      res.status(403).send(accessDeniedPage("Invalid or missing payment session."));
      return null;
    }

    const stripe = await getStripeForVerification();
    if (!stripe) {
      res.status(503).send(accessDeniedPage("Payment verification unavailable."));
      return null;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      res.status(403).send(accessDeniedPage("Payment not completed."));
      return null;
    }

    const userId = (req.session as any)?.userId;
    if (userId && session.metadata?.userId && String(userId) !== String(session.metadata.userId)) {
      res.status(403).send(accessDeniedPage("This payment belongs to a different account."));
      return null;
    }

    return session;
  }

  app.get("/success/repair", async (req, res) => {
    try {
      const session = await verifyStripeSession(req, res);
      if (!session) return;

      res.send(successPage(
        "PURCHASE COMPLETE",
        "Thank you for purchasing Sireen Repair Mode!<br>Your account has been activated automatically. Open the app and all 18 missions will be unlocked.",
        "repair"
      ));
    } catch (err) {
      console.error("Success page verification error:", err);
      return res.status(403).send(accessDeniedPage("Could not verify payment."));
    }
  });

  app.get("/success/university", async (req, res) => {
    try {
      const session = await verifyStripeSession(req, res);
      if (!session) return;

      res.send(successPage(
        "UNIVERSITY ACTIVATED",
        "Welcome to Sireen Business Credit University!<br>Your account has been activated automatically. Open the app and all 12 BCU modules will be unlocked.",
        "university"
      ));
    } catch (err) {
      console.error("Success page verification error:", err);
      return res.status(403).send(accessDeniedPage("Could not verify payment."));
    }
  });

  app.get("/success/letters", async (req, res) => {
    try {
      const session = await verifyStripeSession(req, res);
      if (!session) return;

      res.send(successPage(
        "PURCHASE COMPLETE",
        "Thank you for purchasing the Sireen Dispute Packet!<br>Your account has been activated automatically. Open the app and all 15 letter templates will be unlocked.",
        "letters"
      ));
    } catch (err) {
      console.error("Success page verification error:", err);
      return res.status(403).send(accessDeniedPage("Could not verify payment."));
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function getStripeForVerification() {
  const Stripe = (await import("stripe")).default;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-04-30.basil" as any });
}

const checkoutPageStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0A0E1A;
    color: #E2E8F0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
    text-align: center;
  }
  h1 { font-size: 24px; color: #D4AF37; margin-bottom: 8px; letter-spacing: 1px; }
  .subtitle { font-size: 15px; color: #94A3B8; margin-bottom: 32px; line-height: 1.5; }
  .checkout-price { font-size: 32px; font-weight: 700; color: #D4AF37; margin-bottom: 24px; }
  stripe-buy-button { margin-bottom: 20px; }
  .secure { font-size: 11px; color: #64748B; margin-top: 12px; }
`;

function successPage(title: string, message: string, product: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Sireen</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0A0E1A;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      text-align: center;
    }
    .success-icon { font-size: 64px; margin-bottom: 16px; }
    h1 { font-size: 24px; color: #D4AF37; margin-bottom: 8px; letter-spacing: 1px; }
    .subtitle { font-size: 15px; color: #94A3B8; margin-bottom: 32px; line-height: 1.5; max-width: 400px; }
    .instructions {
      background: #111827;
      border-radius: 12px;
      padding: 20px 24px;
      max-width: 400px;
      border: 1px solid #2D3A52;
    }
    .instructions h3 { font-size: 14px; color: #E2E8F0; margin-bottom: 12px; }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
      text-align: left;
    }
    .step-num {
      background: #D4AF37;
      color: #000;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .step-text { font-size: 13px; color: #94A3B8; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="success-icon">✅</div>
  <h1>${title}</h1>
  <p class="subtitle">${message}</p>
  <div class="instructions">
    <h3>Next Steps</h3>
    <div class="step"><span class="step-num">1</span><span class="step-text">Open the Sireen app</span></div>
    <div class="step"><span class="step-num">2</span><span class="step-text">${product === "repair" ? "All 18 missions are now unlocked" : product === "university" ? "All 12 Business Credit University modules are now unlocked" : "Go to the Letters tab — all templates are available"}</span></div>
    <div class="step"><span class="step-num">3</span><span class="step-text">If content doesn't appear unlocked, log out and log back in</span></div>
  </div>
</body>
</html>`;
}

function accessDeniedPage(reason: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied — Sireen</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0A0E1A;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      text-align: center;
    }
    .icon { font-size: 64px; margin-bottom: 16px; }
    h1 { font-size: 24px; color: #EF4444; margin-bottom: 8px; letter-spacing: 1px; }
    .subtitle { font-size: 15px; color: #94A3B8; max-width: 400px; }
  </style>
</head>
<body>
  <div class="icon">🚫</div>
  <h1>ACCESS DENIED</h1>
  <p class="subtitle">${reason}</p>
</body>
</html>`;
}
