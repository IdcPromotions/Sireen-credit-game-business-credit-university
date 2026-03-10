import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { answerKeys } from "./answers";

const PREMIUM_DURATION_DAYS = 30;

export async function registerRoutes(app: Express): Promise<Server> {
  const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey) {
    console.warn("STRIPE_PUBLISHABLE_KEY not set — checkout pages will not function");
  }

  app.post("/api/grade-quiz", (req, res) => {
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

    const key = answerKeys[lessonId];
    if (!key) {
      return res.status(404).json({ message: "Answer key not found for this lesson" });
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

  app.post("/api/activate", (req, res) => {
    const { key, product } = req.body as { key: string; product: string };

    if (
      !key ||
      !product ||
      typeof key !== "string" ||
      typeof product !== "string" ||
      key.length > 200 ||
      !["repair", "letters"].includes(product)
    ) {
      return res.status(400).json({ valid: false, message: "Invalid request" });
    }

    const trimmedKey = key.trim();

    if (product === "repair") {
      const repairKey = process.env.REPAIR_ACTIVATION_KEY;
      if (!repairKey) {
        return res.status(500).json({ valid: false, message: "Activation system not configured" });
      }
      if (trimmedKey === repairKey) {
        const expiresAt = new Date(Date.now() + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
        return res.json({ valid: true, product: "repair", expiresAt, durationDays: PREMIUM_DURATION_DAYS });
      }
      return res.status(401).json({ valid: false, message: "Invalid activation key" });
    }

    if (product === "letters") {
      const lettersKey = process.env.LETTERS_ACTIVATION_KEY;
      if (!lettersKey) {
        return res.status(500).json({ valid: false, message: "Activation system not configured" });
      }
      if (trimmedKey === lettersKey) {
        return res.json({ valid: true, product: "letters" });
      }
      return res.status(401).json({ valid: false, message: "Invalid activation key" });
    }

    return res.status(400).json({ valid: false, message: "Unknown product" });
  });

  app.post("/api/verify-premium", (req, res) => {
    const { key, product } = req.body as { key: string; product: string };

    if (
      !key ||
      !product ||
      typeof key !== "string" ||
      typeof product !== "string" ||
      key.length > 200 ||
      !["repair", "letters"].includes(product)
    ) {
      return res.status(400).json({ active: false, message: "Invalid request" });
    }

    const trimmedKey = key.trim();

    if (product === "repair") {
      const repairKey = process.env.REPAIR_ACTIVATION_KEY;
      if (repairKey && trimmedKey === repairKey) {
        const expiresAt = new Date(Date.now() + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
        return res.json({ active: true, product: "repair", expiresAt, durationDays: PREMIUM_DURATION_DAYS });
      }
      return res.json({ active: false, product: "repair", message: "Key no longer valid or subscription expired" });
    }

    if (product === "letters") {
      const lettersKey = process.env.LETTERS_ACTIVATION_KEY;
      if (lettersKey && trimmedKey === lettersKey) {
        return res.json({ active: true, product: "letters" });
      }
      return res.json({ active: false, product: "letters", message: "Key no longer valid" });
    }

    return res.json({ active: false, message: "Unknown product" });
  });

  const successPageStyles = `
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
    .subtitle { font-size: 15px; color: #94A3B8; margin-bottom: 32px; line-height: 1.5; }
    .key-label { font-size: 12px; color: #64748B; letter-spacing: 2px; margin-bottom: 8px; text-transform: uppercase; }
    .key-box {
      background: #111827;
      border: 2px solid #D4AF37;
      border-radius: 12px;
      padding: 20px 32px;
      margin-bottom: 12px;
      min-width: 280px;
    }
    .key-value {
      font-size: 22px;
      font-weight: 700;
      color: #D4AF37;
      letter-spacing: 3px;
      font-family: 'Courier New', Courier, monospace;
      word-break: break-all;
      user-select: all;
    }
    .copy-btn {
      background: #D4AF37;
      color: #000;
      border: none;
      border-radius: 8px;
      padding: 12px 32px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 24px;
      letter-spacing: 1px;
    }
    .copy-btn:hover { background: #E5C04B; }
    .copy-btn:active { transform: scale(0.97); }
    .copied { background: #22C55E !important; }
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
    .price { font-size: 14px; color: #94A3B8; margin-bottom: 24px; }
    .checkout-price { font-size: 32px; font-weight: 700; color: #D4AF37; margin-bottom: 24px; }
    stripe-buy-button { margin-bottom: 20px; }
    .secure { font-size: 11px; color: #64748B; margin-top: 12px; }
  `;

  const copyScript = `
    function copyKey() {
      const keyEl = document.getElementById('activation-key');
      const btn = document.getElementById('copy-btn');
      navigator.clipboard.writeText(keyEl.textContent.trim()).then(() => {
        btn.textContent = 'COPIED!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'COPY KEY'; btn.classList.remove('copied'); }, 2000);
      }).catch(() => {
        const range = document.createRange();
        range.selectNode(keyEl);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      });
    }
  `;

  app.get("/repair-checkout", (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sireen Repair Mode — Checkout</title>
  <style>${successPageStyles}</style>
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
  <style>${successPageStyles}</style>
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

  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  app.get("/success/repair", (_req, res) => {
    const activationKey = process.env.REPAIR_ACTIVATION_KEY;
    if (!activationKey) {
      return res.status(503).send("Activation system is being configured. Please check back shortly.");
    }
    const safeKey = escapeHtml(activationKey);
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Complete — Sireen Repair Mode</title>
  <style>${successPageStyles}</style>
</head>
<body>
  <div class="success-icon">✅</div>
  <h1>PURCHASE COMPLETE</h1>
  <p class="subtitle">Thank you for purchasing Sireen Repair Mode!<br>Use the activation key below to unlock all 18 missions.</p>
  <p class="key-label">Your Activation Key</p>
  <div class="key-box">
    <span class="key-value" id="activation-key">${safeKey}</span>
  </div>
  <button class="copy-btn" id="copy-btn" onclick="copyKey()">COPY KEY</button>
  <div class="instructions">
    <h3>How to Activate</h3>
    <div class="step"><span class="step-num">1</span><span class="step-text">Open the Sireen app</span></div>
    <div class="step"><span class="step-num">2</span><span class="step-text">Go to any locked lesson and tap "Upgrade"</span></div>
    <div class="step"><span class="step-num">3</span><span class="step-text">Tap "Have an activation key?"</span></div>
    <div class="step"><span class="step-num">4</span><span class="step-text">Paste your key and tap Activate</span></div>
  </div>
  <script>${copyScript}</script>
</body>
</html>`);
  });

  app.get("/success/letters", (_req, res) => {
    const activationKey = process.env.LETTERS_ACTIVATION_KEY;
    if (!activationKey) {
      return res.status(503).send("Activation system is being configured. Please check back shortly.");
    }
    const safeKey = escapeHtml(activationKey);
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Complete — Sireen Dispute Packet</title>
  <style>${successPageStyles}</style>
</head>
<body>
  <div class="success-icon">✅</div>
  <h1>PURCHASE COMPLETE</h1>
  <p class="subtitle">Thank you for purchasing the Sireen Dispute Packet!<br>Use the activation key below to unlock all 15 letter templates.</p>
  <p class="key-label">Your Activation Key</p>
  <div class="key-box">
    <span class="key-value" id="activation-key">${safeKey}</span>
  </div>
  <button class="copy-btn" id="copy-btn" onclick="copyKey()">COPY KEY</button>
  <div class="instructions">
    <h3>How to Activate</h3>
    <div class="step"><span class="step-num">1</span><span class="step-text">Open the Sireen app</span></div>
    <div class="step"><span class="step-num">2</span><span class="step-text">Go to the Letters tab</span></div>
    <div class="step"><span class="step-num">3</span><span class="step-text">Tap "Have an activation key?"</span></div>
    <div class="step"><span class="step-num">4</span><span class="step-text">Paste your key and tap Activate</span></div>
  </div>
  <script>${copyScript}</script>
</body>
</html>`);
  });

  const httpServer = createServer(app);
  return httpServer;
}
