# Sireen Credit Game

A mission-based credit education and restoration training app built with Expo + Express.

## App Overview

SIREEN CREDIT GAME transforms credit education into a mission-based learning experience. Users train through lessons, pass checkpoint quizzes (80% required), and unlock higher-level repair systems.

## Architecture

### Frontend (Expo Router — port 8081)
- **Framework**: Expo SDK 54 + React Native
- **Navigation**: Expo Router (file-based) with tab navigation
- **State**: React Context (`context/GameContext.tsx` for game progress, `context/AuthContext.tsx` for auth) + AsyncStorage for local game progress
- **Styling**: React Native StyleSheet with consistent dark tactical theme

### Backend (Express — port 5000)
- **Framework**: Express with TypeScript
- **Database**: PostgreSQL (users table, session table)
- **Auth**: Email/password with bcryptjs hashing, express-session with connect-pg-simple
- **Payments**: Stripe Checkout Sessions for subscriptions (monthly) and one-time purchases
- **Quiz Grading**: `server/answers.ts` (secret) — answer keys never exposed to client

### Key Server Files
- `server/index.ts` — Main Express server setup (CORS, helmet, session, rate limiting)
- `server/routes.ts` — Quiz grading, legacy activation endpoints, success pages
- `server/auth.ts` — Auth routes (register, login, logout, me)
- `server/stripe.ts` — Stripe Checkout Sessions + webhook handler
- `server/db.ts` — PostgreSQL pool connection
- `server/answers.ts` — SECRET answer keys (server-only)

### API Endpoints
- `POST /api/auth/register` — Create account with email/password
- `POST /api/auth/login` — Login with email/password
- `POST /api/auth/logout` — Destroy session
- `GET /api/auth/me` — Get current user with subscription status
- `POST /api/subscribe/repair` — Create Stripe Checkout Session for monthly subscription ($9.99/mo)
- `POST /api/subscribe/letters` — Create Stripe Checkout Session for one-time letter purchase ($50)
- `GET /api/subscription/status` — Get subscription details
- `POST /api/webhooks/stripe` — Stripe webhook handler (raw body, before JSON parser)
- `POST /api/grade-quiz` — Grade quiz submissions

## App Structure

### Auth Screens
- `app/(auth)/login.tsx` — Email/password login
- `app/(auth)/register.tsx` — Email/password registration
- Auto-redirect: unauthenticated users go to login, authenticated users go to main app

### Tabs
- `app/(tabs)/index.tsx` — Missions screen (Bootcamp + Repair Mode + BCU sections, XP, rank)
- `app/(tabs)/letters.tsx` — Dispute letter templates (separate $50 purchase)
- `app/(tabs)/profile.tsx` — Profile, rank, badges, stats, logout

### Screens
- `app/lesson/[id].tsx` — Lesson content screen (premium-gated for lessons 6-18, university-gated for BCU 101-112)
- `app/quiz/[id].tsx` — Quiz checkpoint screen (shuffled options, premium/university-gated)
- `app/mission-complete.tsx` — Animated completion screen
- `app/upgrade.tsx` — Repair Mode subscription modal ($14.99/month auto-pay)
- `app/funding-score.tsx` — Funding Score Calculator (8-category business funding readiness assessment)

### Data Files
- `data/lessons.ts` — All 18 credit repair lesson definitions (content + quiz questions, NO answers)
- `data/bcu-lessons.ts` — 12 Business Credit University modules (IDs 101-112, premium-locked)
- `data/letters.ts` — 15 dispute letter templates

## Key Features

### User Authentication
- Email/password registration and login
- Server-side session management (connect-pg-simple) with session regeneration on login/register
- Premium status tracked in PostgreSQL users table
- Auth state managed via AuthContext (wraps entire app)
- Server-side entitlement checks on quiz grading (premium/BCU lessons require active subscription)
- Rate limiting on auth, quiz, and subscribe endpoints
- Success pages verify Stripe checkout session before displaying

### Free Tier (Bootcamp Mode)
- 5 lessons: Welcome, 5 Credit Stats, Reading Reports, Negative Items, Credit Myths
- Quiz checkpoints with 80% pass requirement
- XP + badge system

### Premium Tier (Repair Mode — $14.99/month auto-pay)
- Lessons 6-18: Audit, Disputes, Collections, Charge-offs, Escalation, Rebuild
- **Stripe Checkout Sessions**: Creates subscription via server-side API
- **Webhook-driven**: Stripe webhooks update user's premium status automatically
- **Auto-renewal**: Monthly recurring billing via Stripe
- **Server-side verification**: isPremium derived from user record in PostgreSQL
- **Subscription lifecycle**: checkout.session.completed → invoice.payment_succeeded → invoice.payment_failed → customer.subscription.deleted

### Business Credit University ($85.00/month auto-pay)
- 12 modules (IDs 101-112) covering bureaus, vendors, scores, tiers, disputes, funding
- Locked behind `hasUniversity` flag (DB columns: `has_university`, `bcu_subscription_id`, `bcu_expires_at`)
- Separate Stripe subscription from Repair Mode — $85/month recurring
- Upgrade screen at `app/upgrade-university.tsx` with teal-themed design
- Stripe Buy Button ID: `buy_btn_1T9IUe43frjv7jhd9yLI8oSz`
- Server-side checkout via `/api/subscribe/university` endpoint
- Webhook handles BCU lifecycle: activation, renewal, failure, cancellation
- Appears in main Missions screen after lesson 18 with BCU banner separator image
- 10-level gamified progression system with badges (Startup → Enterprise)

### Dispute Letter Packet ($50 — one-time purchase)
- 15 professional dispute letter templates (bureau, collector, creditor, escalation)
- Stripe Checkout Session for one-time payment
- hasLetters tracked server-side per user

### Quiz System
- Options are shuffled using seeded random per question
- Server-side grading compares answer TEXT, not position
- State fully resets when route `id` parameter changes

### Funding Score Calculator
- 8-category scoring system: Time in Business, Revenue, Bank Stability, Tradeline Depth, Credit Quality, Utilization/Debt, Public Records, Identity/Compliance
- Max 100 points (15+15+15+12+15+12+8+8)
- Approval odds tiers: 90-100 (85%-95%), 75-89 (70%-84%), 60-74 (50%-69%), 40-59 (25%-49%), 0-39 (5%-24%)
- Accessible from Missions screen via gold card button
- Includes animated results with per-category breakdown bars and tier legend

### Gamification
- **Ranks**: Rookie → Builder → Strategist → Operator → Commander → Elite Restorer
- **XP**: 50-200 XP per lesson (based on score)
- **Badges**: 10 earnable badges
- Progress tracked in AsyncStorage (local to device)

## Theme/Colors
- Dark tactical aesthetic (deep navy background)
- Gold accents for premium/XP elements  
- Electric teal for active/interactive states
- Constants in `constants/colors.ts`

## Security
- **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
- **Rate Limiting**: 100 req/15min for quizzes, 20 req/15min for auth
- **CORS**: Restricted to Replit domains; localhost only in development
- **Password Hashing**: bcryptjs with 12 rounds
- **Sessions**: httpOnly, secure in production, sameSite
- **Stripe Webhooks**: Signature verification when STRIPE_WEBHOOK_SECRET is set
- **Input Validation**: Strict type/length/range checks on all endpoints

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Express session secret
- `STRIPE_SECRET_KEY` — Stripe API secret key (required for subscriptions)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (optional, for signature verification)
- `STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (for legacy checkout pages)
- `REPAIR_ACTIVATION_KEY` — Legacy activation key (kept for backward compat)
- `LETTERS_ACTIVATION_KEY` — Legacy activation key (kept for backward compat)

## Workflows
- **Start Backend**: `npm run server:dev` (port 5000)
- **Start Frontend**: `npm run expo:dev` (port 8081)
