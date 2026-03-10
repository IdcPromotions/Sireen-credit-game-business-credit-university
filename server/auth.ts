import { Router } from "express";
import bcrypt from "bcryptjs";
import pool from "./db";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 255 ||
    password.length < 6 ||
    password.length > 128 ||
    !EMAIL_REGEX.test(email)
  ) {
    return res.status(400).json({ message: "Valid email and password (min 6 characters) required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, is_premium, premium_expires_at, has_letters, has_university, subscription_status, created_at`,
      [normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    (req.session as any).userId = user.id;

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.is_premium,
        premiumExpiresAt: user.premium_expires_at,
        hasLetters: user.has_letters,
        hasUniversity: user.has_university,
        subscriptionStatus: user.subscription_status,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash, is_premium, premium_expires_at, has_letters, has_university, subscription_status FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let isPremium = user.is_premium;
    if (isPremium && user.premium_expires_at) {
      const expiresAt = new Date(user.premium_expires_at).getTime();
      if (expiresAt < Date.now()) {
        isPremium = false;
        await pool.query(
          "UPDATE users SET is_premium = false, subscription_status = 'expired' WHERE id = $1",
          [user.id]
        );
      }
    }

    (req.session as any).userId = user.id;

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        isPremium,
        premiumExpiresAt: user.premium_expires_at,
        hasLetters: user.has_letters,
        hasUniversity: user.has_university,
        subscriptionStatus: isPremium ? user.subscription_status : (user.subscription_status === 'expired' ? 'expired' : user.subscription_status),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("sireen_session");
    return res.json({ message: "Logged out" });
  });
});

router.get("/me", async (req, res) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, is_premium, premium_expires_at, has_letters, has_university, subscription_status, stripe_customer_id, stripe_subscription_id FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    let isPremium = user.is_premium;
    if (isPremium && user.premium_expires_at) {
      const expiresAt = new Date(user.premium_expires_at).getTime();
      if (expiresAt < Date.now()) {
        isPremium = false;
        await pool.query(
          "UPDATE users SET is_premium = false, subscription_status = 'expired' WHERE id = $1",
          [user.id]
        );
      }
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        isPremium,
        premiumExpiresAt: user.premium_expires_at,
        hasLetters: user.has_letters,
        hasUniversity: user.has_university,
        subscriptionStatus: isPremium ? user.subscription_status : (user.is_premium !== isPremium ? 'expired' : user.subscription_status),
      },
    });
  } catch (err) {
    console.error("Me endpoint error:", err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;
