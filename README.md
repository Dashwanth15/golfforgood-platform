<div align="center">

# ⛳ GolfForGood

### *Play Golf. Support Charities. Win Prizes.*

**A full-stack, subscription-based SaaS platform where golf becomes a force for good.**

---

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout%20%2B%20Webhooks-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

> **GolfForGood** is a production-grade SaaS platform that transforms the sport of golf into a charitable ecosystem. Subscribers track their golf scores, which automatically enter them into monthly prize draws. A portion of every subscription goes to their chosen charity, while prize pools accumulate from the remaining revenue. Real winners. Real donations. Real impact.

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Business Value & Impact](#-business-value--impact)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Database Design](#-database-design)
- [Authentication Flow](#-authentication-flow)
- [Stripe Payment Flow](#-stripe-payment-flow)
- [Subscription Lifecycle](#-subscription-lifecycle)
- [Draw & Winner Workflow](#-draw--winner-workflow)
- [API Overview](#-api-overview)
- [Folder Structure](#-folder-structure)
- [Engineering Highlights](#-engineering-highlights)
- [Security & Reliability](#-security--reliability)
- [Quality & Testing](#-quality--testing)
- [Installation & Local Setup](#-installation--local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Project Journey](#-project-journey)
- [Future Enhancements](#-future-enhancements)
- [Key Technical Achievements](#-key-technical-achievements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌟 Project Overview

GolfForGood is a purpose-built, subscription-based SaaS platform that fuses the sport of golf with charitable giving and competitive prize draws. At its core, it solves a deceptively complex problem: how do you build a system where a user's athletic performance (their golf score) becomes both their entry ticket into a prize draw *and* a charitable contribution mechanism — all automatically, securely, and at scale?

The answer is a tightly integrated full-stack application spanning a React frontend, a RESTful Express.js backend, a PostgreSQL database hosted on Supabase, Stripe for payment processing, Resend for transactional emails, and Supabase Storage for secure media management.

**The business model is simple but powerful:**
- Users subscribe monthly or yearly.
- Their 5 most recent golf scores form their draw entry numbers.
- A percentage of each subscription is allocated to their chosen charity.
- Monthly draws are administered, winners are identified by number match, and prizes are claimed through a verified workflow.

This README documents the complete architecture, engineering decisions, data model, and operational workflows of the platform — written not just as documentation, but as an engineering case study demonstrating how modern full-stack development can be applied to solve real-world, multi-dimensional product challenges.

---

## 🚀 Live Demo

> 🌐 **Frontend:** [https://golfforgood-frontend.onrender.com](https://golfforgood-frontend.onrender.com)
>
> ⚙️ **Backend API:** [https://golfforgood-backend.onrender.com](https://golfforgood-backend.onrender.com)

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@golfforgood.com` | `Admin@123` |
| **Subscriber** | `user@golfforgood.com` | `User@123` |

> ⚠️ **Note:** These are demo credentials for a test-mode environment. Stripe payments use test card `4242 4242 4242 4242`. No real charges are ever made.

### 📸 Screenshots

| Dashboard | Admin Panel | Charity Selection |
|-----------|-------------|-------------------|
| User KPI overview with score tracking | Full admin analytics & draw management | Charity grid with contribution settings |

> Full screenshot gallery available on request.

---

## 💼 Business Value & Impact

GolfForGood is more than a technical project — it is a product with a coherent business model, measurable social impact, and a clear value proposition for three distinct stakeholders. Understanding the business context is essential to appreciating the engineering decisions made throughout the platform.

### For Subscribers — Play With Purpose

Traditional golf apps offer performance tracking in isolation. GolfForGood transforms every round of golf into a multi-dimensional event: a score submission is simultaneously a draw entry, a charitable contribution, and a moment of community participation. Subscribers receive tangible value — monthly prize draws with real cash prizes — while also experiencing the psychological benefit of knowing their hobby supports a cause they chose themselves. The subscription model is priced accessibly (£9.99/month or £99.99/year) to maximise adoption while sustaining the prize pool and charity allocation simultaneously.

**Subscriber value loop:**
1. Pay subscription → Select charity → Submit golf scores
2. Scores enter monthly draw automatically
3. Portion of fee routed to chosen charity in real-time
4. Win prizes based on score-number matches
5. Claim prize through verified workflow
6. Renew with higher engagement due to accumulated stake

### For Charities — Recurring, Transparent Funding

Charities listed on the platform receive a predictable, recurring revenue stream without fundraising overhead. Unlike one-time donation campaigns, GolfForGood creates ongoing allocation through the subscription contribution model. Each active subscriber contributes a minimum 10% of their subscription fee to their selected charity every billing cycle. The platform's charity analytics surface total funds raised and donor counts, giving charity administrators transparent reporting without requiring API integrations or custom dashboards. Featured charities receive higher visibility on the selection screen, creating a natural incentivisation for charity partners to engage with the platform.

### For Platform Administrators — Full Operational Control

The admin dashboard gives operators complete control over the platform lifecycle. Revenue analytics show real-time subscription income, charity allocation totals, and prize pool accumulation. Draw management follows a structured workflow (draft → simulate → generate → publish) that prevents operational errors and ensures prize pools are correctly calculated before results are communicated. The winner verification workflow creates an audit trail from draw publication to prize payment, protecting the platform from fraudulent claims. Every entity — users, subscriptions, charities, draws, claims — is manageable from a single, role-protected admin interface.

### The Business Model in Numbers

| Revenue Event | Amount | Charity Allocation | Prize Pool |
|---|---|---|---|
| Monthly subscription (10% charity) | £9.99 | £1.00 | £8.99 |
| Monthly subscription (50% charity) | £9.99 | £5.00 | £4.99 |
| Yearly subscription (10% charity) | £99.99 | £10.00 | £89.99 |
| Yearly subscription (50% charity) | £99.99 | £50.00 | £49.99 |

> Subscriber controls the charity split. Platform accumulates the prize pool portion. Both scale linearly with subscriber count — the more users play, the bigger the prizes and the greater the charitable impact.

---

## ✨ Key Features

GolfForGood is far more than a CRUD application. It is a multi-role, event-driven platform with real financial workflows, automated business logic, and a polished user experience. Below is a structured breakdown of every major capability.

### 🔐 Authentication & Security

The platform implements a dual-authentication strategy. Users can register and log in with email/password credentials or use Google OAuth for one-click sign-in — both powered by Supabase Auth. Every API endpoint is protected by JWT middleware that validates the user's identity on every request. Role-based access control (RBAC) ensures that only users with the `admin` role can access the admin dashboard endpoints, while regular subscribers are silently restricted via server-side middleware. Suspended accounts are caught at the authorization layer, preventing any data access without a password reset cycle.

### 💳 Subscription Management

GolfForGood's entire economic model revolves around subscriptions. The platform offers two plan types — **Monthly** and **Yearly** — each stored in a normalised `subscription_plans` table. When a user purchases a plan, a `subscription` record is created with precise `start_date`, `end_date`, and `renewal_date` values calculated server-side. A dedicated middleware checks subscription status on protected routes, preventing expired users from submitting scores, entering draws, or claiming prizes. Admins can view, modify, and cancel subscriptions from the admin dashboard, with all state transitions logged for audit purposes.

### 💰 Stripe Payments

The payment infrastructure is built on **Stripe Checkout** and **Stripe Webhooks**. Rather than building a custom payment form (which carries significant PCI compliance burden), GolfForGood redirects users to a Stripe-hosted checkout session that handles card capture, 3D Secure authentication, and receipt generation natively. After a successful payment, Stripe dispatches a signed `checkout.session.completed` webhook event to the platform's `/api/payments/webhook` endpoint. The server verifies the webhook signature using the `STRIPE_WEBHOOK_SECRET`, extracts the `user_id` and `plan_id` from the session metadata, activates the subscription in the database, and triggers an email notification — all within a single, idempotent transaction. The entire flow is non-blocking and designed to be resilient to retry events.

### 📧 Email Notifications

Every significant platform event triggers a transactional email via **Resend**. The `EmailService` class abstracts all email logic behind a clean, injectable interface. Emails are dispatched for: subscription activation, draw publication, winner alerts, claim approvals, and claim rejections. Crucially, email failures are **non-blocking** — they are caught in isolated `try/catch` blocks so that a transient SMTP error never rolls back a subscription activation or payment confirmation. The system is designed to fail gracefully and log errors without impacting the core user experience.

### 🏥 Charity System

The charity system is one of the platform's most distinctive features. Administrators can create and manage a directory of partner charities, each with a name, description, category, featured status, website URL, and a media image hosted in Supabase Storage. Subscribers select a charity from this directory and set a **contribution percentage** (minimum 10%) of their subscription fee that is earmarked for their chosen cause. This creates a transparent, user-driven philanthropy model where subscribers feel direct ownership over the impact of their membership. The platform tracks total funds raised and donor counts per charity, surfacing these metrics on the charity selection screen to inspire engagement.

### ⛳ Golf Score System

The golf score system is the entry mechanism for the monthly draw. Each subscriber can log up to 5 golf scores, each tied to a specific date. The system enforces a **rolling window** — when a 6th score is submitted, the oldest score is automatically removed. This design keeps entries fresh and encourages regular play. Each score value (a number between 1 and 45) becomes one of the subscriber's draw entry numbers, creating a direct, tangible connection between performance on the course and participation in the prize draw.

### 🎟️ Draw & Prize System

The monthly draw system is a fully administrated workflow. Admins create a draw for a specific calendar month, specifying total revenue. The system can **simulate** a draw to preview match statistics before numbers are committed. When ready, admins trigger number generation, which produces 5 winning numbers and allocates prize pools across match levels (3-match, 4-match, 5-match jackpot). A **jackpot rollover** mechanism ensures that unmatched jackpots accumulate into the next draw, incentivising long-term subscriber retention. Once generated, draws are published to all active subscribers via email, and winner claims are automatically created in the database.

### 🏆 Winner Claims

Winners are identified automatically when a draw is published — any subscriber whose score numbers match 3 or more winning numbers receives a `winner_claim` record. To claim their prize, winners must upload photographic proof of identity through the platform. This proof is stored securely in Supabase Storage and reviewed by administrators. Admins can approve or reject claims with optional admin notes, and mark approved claims as paid. The full audit trail — from draw creation to payment — is preserved in the database for compliance and transparency.

### 🛡️ Admin Dashboard

The admin dashboard is a complete back-office management system. Admins have full CRUD access to users (including direct score management), subscriptions (status updates and cancellations), charities (create, edit, delete, media upload), draws (create, simulate, generate, publish), winner claims (review, approve, reject, mark paid), and platform-wide analytics. The analytics module surfaces key performance indicators including total revenue, active subscribers, donation volumes, charity allocation totals, and draw participation rates — all computed in real-time from the database.

---

## 🏗️ Architecture

GolfForGood is structured as a classic **three-tier web application** with a clear separation of concerns between presentation, business logic, and data persistence. Each layer communicates through well-defined interfaces, enabling independent scaling and maintenance.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│              React + TypeScript + Tailwind CSS                  │
│         TanStack Query · React Router · Axios · Framer          │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTPS REST API
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EXPRESS.JS API SERVER                     │
│                    Node.js + TypeScript                         │
│   Auth Middleware · RBAC · Subscription Guard · Rate Limiting   │
│   Controllers → Services → Repositories                         │
└────┬──────────────────┬──────────────────┬───────────────────┬──┘
     │                  │                  │                   │
     ▼                  ▼                  ▼                   ▼
┌─────────┐    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│Supabase │    │  Supabase    │   │    Stripe    │   │   Resend     │
│PostgreSQL│   │  Storage     │   │  Checkout +  │   │Transactional │
│Database  │   │  Buckets     │   │  Webhooks    │   │    Email     │
└─────────┘    └──────────────┘   └──────────────┘   └──────────────┘
```

### Frontend Architecture

The frontend is a **Single-Page Application (SPA)** built with React 19 and TypeScript, bundled by Vite for near-instant hot module replacement during development. The application is structured around a feature-based directory layout — each domain (auth, subscriptions, scores, charities, draws) has its own API client, types, and store slice. Global server state is managed by **TanStack Query**, which handles caching, background refetching, loading states, and optimistic updates out of the box. Local component state is handled by React hooks, while global auth state is persisted through **Zustand**. All API requests are made via a configured **Axios** instance that automatically attaches the JWT from local storage and handles 401 redirect flows.

### Backend Architecture

The Express.js backend follows a **layered architecture** pattern: Routes → Controllers → Services → Database. Routes define the HTTP surface area and attach middleware. Controllers parse request payloads and delegate to Services. Services contain all business logic — subscription calculation, draw number generation, prize pool allocation, and email triggering. The data layer communicates directly with Supabase PostgreSQL via the Supabase JS client. This strict separation ensures that the database layer can be swapped out without touching business logic, and that controllers remain thin and testable.

### Database Architecture

The Supabase-hosted PostgreSQL database is the single source of truth for all platform state. Tables are designed with normalised relationships — subscriptions reference users and plans, donations reference users and charities, winner_claims reference draws and users — enabling complex cross-domain queries without data duplication. Row-Level Security (RLS) policies are applied at the Supabase layer for an additional security boundary. All timestamps are stored in UTC.

### Payment Architecture

The payment flow is entirely server-side orchestrated. The frontend never touches raw card data — it simply calls the backend to create a Stripe Checkout Session and receives a URL. After payment, Stripe contacts the backend directly via a signed webhook, completely bypassing the browser. This architecture is PCI DSS compliant by design, since sensitive card data never passes through our servers.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component-based UI with full type safety |
| **Build Tool** | Vite | Lightning-fast development server & bundler |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design system |
| **Routing** | React Router v7 | Client-side navigation and protected routes |
| **Server State** | TanStack Query v5 | Data fetching, caching, and synchronization |
| **HTTP Client** | Axios | API requests with interceptors |
| **Animation** | Framer Motion | Micro-interactions and page transitions |
| **Forms** | React Hook Form + Zod | Schema-based form validation |
| **Backend** | Node.js + Express.js | RESTful API server |
| **Backend Language** | TypeScript | End-to-end type safety |
| **Database** | Supabase PostgreSQL | Relational data storage |
| **Authentication** | Supabase Auth + Google OAuth | Multi-strategy auth with JWT |
| **Storage** | Supabase Storage | File uploads (charity images, winner proofs) |
| **Payments** | Stripe Checkout + Webhooks | Subscription billing |
| **Email** | Resend | Transactional email delivery |
| **Deployment** | Render | Cloud hosting for frontend and backend |

---

## 🗄️ Database Design

The database schema is the backbone of GolfForGood's business logic. Each table is intentionally designed around a specific domain, with clear foreign key relationships that model the real-world relationships between users, subscriptions, charities, draws, and prizes.

### `users`
The central identity table. Stores profile information (name, email, avatar), role (`subscriber` | `admin`), account status (`active` | `suspended`), and a foreign key to the Supabase Auth user. The `role` field gates access to the entire admin subsystem, while `status` allows administrators to suspend accounts without deleting user data.

### `subscription_plans`
A configuration table defining the available subscription tiers. Contains `plan_type` (monthly/yearly), `price_amount`, `currency`, a `features` JSON array, and a `stripe_price_id` linking to the corresponding Stripe product. This table drives both the frontend pricing UI and the backend payment session creation.

### `subscriptions`
The operational subscription record for each user. Tracks the current `status` (active/expired/cancelled), references the active `plan_id`, stores `start_date`, `end_date`, and `renewal_date`, and preserves the `stripe_subscription_id` for webhook reconciliation. Business rules such as expiry detection are evaluated against this table on every protected request.

### `charities`
The charity directory. Each row represents a partner charity with a name, description, category, `is_featured` flag, `is_active` flag, `website_url`, `image_url` (pointing to Supabase Storage), and computed statistics for `total_raised` and `donor_count`. The category field supports a predefined enum (education, health, environment, community, sports, other) for filtering and display purposes.

### `user_charity_selections`
A join table with metadata. Each subscriber can have one active charity selection at a time. The `contribution_pct` column (integer, min 10) controls what percentage of the subscription fee is routed to the selected charity, giving subscribers real agency over the impact of their membership.

### `user_scores`
Stores individual golf scores per user. Each record has a `score_value` (1-45), a `score_date`, and a foreign key to the user. The business rule of a 5-score rolling window is enforced at the service layer — when a 6th score is inserted, a trigger removes the oldest. Scores are used to populate the draw entry numbers for each subscriber.

### `draws`
The monthly draw record. Contains `draw_month` (YYYY-MM format), `status` (draft → simulated → published), `total_revenue`, `winning_numbers` (integer array), and `jackpot_rollover`. The status field drives the admin workflow and determines what actions are available at each stage of the draw lifecycle.

### `prize_pools`
Child records of a draw, one per match level (3, 4, or 5 matches). Each pool stores `pool_amount`, `winner_count`, `per_winner_amount`, and a `rolled_over` flag. When a jackpot has no winners, the `pool_amount` is carried forward and added to the next draw's jackpot pool.

### `draw_entries`
Records each subscriber's participation in a specific draw. Links users to draws with their score snapshot at the time of draw publication. This decoupled approach means historical draw results remain accurate even if a user later modifies their scores.

### `winner_claims`
Created automatically when a draw is published and matching subscribers are identified. Stores `match_level`, `prize_amount`, `claim_status` (pending/approved/rejected), `proof_url`, `payment_status`, `paid_at`, and `admin_notes`. This table powers the entire winner verification and payout workflow.

### `donations`
Tracks all charitable giving events. Each row references the user, the charity, and the `donation_amount`. The `donation_type` field distinguishes between `subscription_allocation` (the automatic percentage split) and `direct_donation` (one-time voluntary contributions), enabling separate analytics for each giving mode.

---

## 🔑 Authentication Flow

GolfForGood implements a dual authentication strategy designed for both security and user convenience.

**Email/Password Registration:** A new user submits their details to `POST /api/auth/register`. The backend validates the input, creates a Supabase Auth user, and inserts a corresponding record in the `users` table with the role of `subscriber`. A JWT is returned immediately, allowing the user to begin using the platform without an email verification step (optimised for demo environments).

**Google OAuth:** Users who prefer social sign-in are redirected through Supabase's Google OAuth flow. On return, the backend receives the OAuth token, extracts the user's profile, creates or fetches the corresponding `users` record, and issues a JWT. The frontend handles the OAuth callback via a dedicated route that resolves the token and updates Zustand auth state.

**Subsequent Requests:** Every API call includes the JWT in the `Authorization: Bearer <token>` header. The `authMiddleware` on the backend validates this token against Supabase, fetches the user record, attaches it to `req.user`, and passes control to the next middleware. If the token is missing, expired, or the user is suspended, the request is rejected with a `401 Unauthorized` response before reaching any business logic.

**Admin Authorization:** Admin-only routes are protected by an additional `requireAdmin` middleware that inspects `req.user.role`. If the role is not `admin`, the request is rejected with `403 Forbidden`. This two-tier middleware chain ensures that even authenticated users cannot escalate their privileges.

---

## 💳 Stripe Payment Flow

The payment architecture is purpose-built to be secure, reliable, and automated.

**Step 1 — Plan Selection:** The subscriber selects a plan on the frontend, which displays plan details fetched from `GET /api/subscriptions/plans`. On confirmation, the frontend calls `POST /api/payments/create-checkout-session` with the selected `plan_id`.

**Step 2 — Session Creation:** The backend fetches the plan's `stripe_price_id`, creates a Stripe Checkout Session with `metadata: { user_id, plan_id }`, and returns the session URL to the frontend. Critically, `user_id` and `plan_id` are embedded in the metadata so the webhook can reconcile the payment without maintaining session state.

**Step 3 — Checkout:** The user is redirected to Stripe's hosted checkout page, where they enter card details in a PCI-compliant environment. On success, they are redirected to `/subscribe/success`.

**Step 4 — Webhook Activation:** Stripe sends a `checkout.session.completed` event to `POST /api/payments/webhook`. The backend verifies the `Stripe-Signature` header using `stripe.webhooks.constructEvent()`. If valid, it extracts the metadata, activates the subscription in the database (calculating `start_date`, `end_date`, and `renewal_date` based on the plan type), and dispatches a confirmation email. The entire handler is idempotent — re-processing a duplicate event is a no-op.

**Step 5 — Confirmation:** The subscriber's dashboard updates in real-time as TanStack Query invalidates and refetches the subscription state after the success page is rendered.

---

## 🔄 Subscription Lifecycle

```
PLAN SELECTED
     │
     ▼
CHECKOUT CREATED (Stripe)
     │
     ▼
PAYMENT COMPLETED
     │
     ▼
WEBHOOK RECEIVED & VERIFIED
     │
     ▼
SUBSCRIPTION ACTIVATED ──────────────────────► EMAIL SENT
     │                                          (Resend)
     │
     ▼
ACTIVE SUBSCRIPTION
  [User can submit scores, select charities, enter draws]
     │
     ├──► Monthly/Yearly period elapses
     │
     ▼
STATUS: EXPIRED ◄──── Automatic detection on login
     │
     ├──► User renews (new checkout) → ACTIVE
     │
     └──► No renewal → EXPIRED (access restricted)

ADMIN can also manually set status:
   ACTIVE → CANCELLED
   CANCELLED → ACTIVE (Reactivation)
```

Subscription enforcement is applied as middleware on score submission, draw entry, charity selection, and winner claim endpoints. An expired subscriber is served a friendly prompt to renew rather than a generic error.

---

## 🎯 Draw & Winner Workflow

The draw system models a real-world lottery administration workflow with four distinct phases:

**Phase 1 — Draft:** An admin creates a draw record for a specific month with the total subscription revenue collected. The draw is in `draft` status and no numbers have been generated.

**Phase 2 — Simulate:** The admin can run a simulation to preview which subscribers would win at each match level given various hypothetical winning numbers. This is a read-only statistical preview and makes no changes to the database. It helps administrators understand prize pool distributions before committing.

**Phase 3 — Generate:** The admin triggers number generation. The backend randomly selects 5 unique numbers from 1–45, allocates prize pools across match levels (40% jackpot to 5-match, proportional splits for 3 and 4 match), and identifies all winning subscribers by comparing their current score numbers against the winning set. A `winner_claim` record is created for each matched subscriber. If the jackpot has no 5-match winner, the pool amount is flagged for rollover into the next draw.

**Phase 4 — Publish:** The admin publishes the draw. All active subscribers receive an email showing the winning numbers. Winners receive a separate personalised email with their match level and prize amount. The draw status becomes `published` and is visible on the subscriber's Draws dashboard.

**Winner Verification:** After receiving their winner email, a subscriber navigates to their Winnings page, where they can see their claim cards. They upload a photo of their ID as proof of identity. Administrators review submitted proofs in the Winner Claims section of the admin dashboard, approve or reject with notes, and mark claims as paid once the prize has been disbursed.

---

## 🌐 API Overview

The backend exposes a structured RESTful API under the `/api` prefix. All responses follow a consistent envelope format: `{ success: boolean, data: T, message?: string, pagination?: Pagination }`.

| Module | Endpoint Group | Key Operations |
|---|---|---|
| **Auth** | `/api/auth` | Register, Login, Google OAuth, Profile |
| **Subscriptions** | `/api/subscriptions` | Get Plans, Purchase, My Subscription, Admin CRUD |
| **Payments** | `/api/payments` | Create Checkout Session, Webhook Handler |
| **Scores** | `/api/scores` | Add, Update, Delete, List My Scores |
| **Charities** | `/api/charities` | List, Create, Update, Delete, Select, Upload Media |
| **Donations** | `/api/charities/donations` | My Donations, Admin Donations |
| **Draws** | `/api/draws` | List, Create, Simulate, Generate, Publish, Upcoming |
| **Winners** | `/api/winners` | My Claims, Upload Proof, Admin Review, Mark Paid |
| **Admin** | `/api/admin` | User Management, Analytics, Score Management |

All write operations on admin endpoints require the `admin` role. All subscriber endpoints require an active subscription where applicable, enforced by the `requireActiveSubscription` middleware.

---

## 📁 Folder Structure

```
GolfForGood/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Layouts.tsx          # DashboardLayout, PublicLayout
│   │   │       ├── Sidebar.tsx          # Navigation sidebar
│   │   │       └── Navbar.tsx           # Public navigation bar
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── authApi.ts
│   │   │   ├── charities/
│   │   │   │   └── charitiesApi.ts
│   │   │   ├── draws/
│   │   │   │   └── drawsApi.ts
│   │   │   ├── scores/
│   │   │   │   └── scoresApi.ts
│   │   │   └── subscription/
│   │   │       └── subscriptionApi.ts
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminOverview.tsx
│   │   │   │   ├── AdminUsers.tsx
│   │   │   │   ├── AdminSubscriptions.tsx
│   │   │   │   ├── AdminCharities.tsx
│   │   │   │   ├── AdminDraws.tsx
│   │   │   │   └── AdminWinners.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Overview.tsx
│   │   │   │   ├── Scores.tsx
│   │   │   │   ├── MyCharity.tsx
│   │   │   │   ├── Donations.tsx
│   │   │   │   ├── Draws.tsx
│   │   │   │   ├── Winnings.tsx
│   │   │   │   └── ManageSubscription.tsx
│   │   │   └── public/
│   │   │       ├── Landing.tsx
│   │   │       ├── Subscribe.tsx
│   │   │       ├── SubscribeSuccess.tsx
│   │   │       └── SubscribeCancel.tsx
│   │   ├── store/
│   │   │   └── authStore.ts             # Zustand auth state
│   │   ├── types/
│   │   │   └── index.ts                 # Shared TypeScript types
│   │   ├── utils/
│   │   │   └── formatters.ts            # Date, currency formatters
│   │   ├── App.tsx                      # Root component + routing
│   │   └── index.css                    # Tailwind design system
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                   # Environment validation
│   │   │   └── supabase.ts              # Supabase client init
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.routes.ts
│   │   │   ├── subscriptions/
│   │   │   ├── payments/
│   │   │   │   ├── payments.controller.ts   # Stripe webhook handler
│   │   │   │   └── payments.routes.ts
│   │   │   ├── charities/
│   │   │   ├── scores/
│   │   │   ├── draws/
│   │   │   ├── winners/
│   │   │   └── admin/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts       # JWT validation
│   │   │   ├── requireAdmin.ts          # Role guard
│   │   │   └── requireActiveSubscription.ts
│   │   ├── shared/
│   │   │   ├── errors/
│   │   │   │   └── AppError.ts          # Centralised error class
│   │   │   └── services/
│   │   │       └── EmailService.ts      # Resend integration
│   │   └── app.ts                       # Express app bootstrap
│   ├── demo_seed.sql                    # Database seed script
│   └── tsconfig.json
│
└── README.md
```

---

## ⚙️ Engineering Highlights

### JWT Authentication & Session Management
Rather than relying on session cookies (which introduce complexity in stateless API designs), GolfForGood uses JWT tokens issued by Supabase Auth. Every API request carries the token in the `Authorization` header. The backend validates the token cryptographically without a database round-trip on every request, then attaches the full user record from the `users` table for downstream middleware use. This architecture scales horizontally without sticky sessions.

### Google OAuth Integration
Google sign-in is implemented through Supabase's OAuth provider abstraction. When a user clicks "Sign in with Google," the frontend initiates the OAuth flow via Supabase's `signInWithOAuth` method. After Google's consent screen, the user is redirected back to the platform with an access token. The backend creates or retrieves the corresponding platform user record transparently, ensuring that OAuth users and email users share the same `users` table and permission model.

### Stripe Webhook Security
The webhook endpoint at `POST /api/payments/webhook` is the most security-critical route in the application. To prevent fraudulent activation attempts, the endpoint uses `stripe.webhooks.constructEvent()` which validates the `Stripe-Signature` header using the `STRIPE_WEBHOOK_SECRET`. This signature is a HMAC-SHA256 hash of the raw request body, meaning even a single byte modification to the payload will invalidate the signature. The route is configured to receive the raw request body (bypassing JSON parsing middleware) specifically to preserve the exact bytes Stripe signed.

### Supabase Storage Integration
Charity logos and winner proof documents are stored in dedicated Supabase Storage buckets. The backend handles multipart form uploads using the Multer middleware, buffers the file in memory (avoiding temporary disk writes), and uploads the buffer directly to Supabase Storage via the `supabase.storage.from(bucket).upload()` API. The resulting public URL is stored in the database. This approach keeps media delivery fast (CDN-backed), storage costs low, and avoids the operational overhead of managing a separate file storage service.

### Subscription Enforcement Middleware
The `requireActiveSubscription` middleware is a reusable Express middleware function that checks whether the authenticated user has an active subscription before allowing access to protected routes. It fetches the subscription record, compares the `end_date` to the current timestamp, and auto-expires records where `end_date` has passed (updating the status in the database as a side effect). This lazy expiry approach means the system doesn't need a cron job to detect and update expired subscriptions — they are detected naturally as users try to access the platform.

### Automatic Expiry Detection
Subscription expiry is handled through a combination of stored `end_date` values and runtime checking in the `requireActiveSubscription` middleware. When a subscription's `end_date` is in the past, the middleware updates the status to `expired` in real-time and returns a `403` response with a structured error that the frontend interprets to display a renewal prompt. This avoids the need for scheduled background jobs during early development while maintaining data accuracy.

### Role-Based Authorization
RBAC is implemented as a composable middleware chain. Every admin route is protected by `[authMiddleware, requireAdmin]`. The `requireAdmin` middleware checks `req.user.role === 'admin'` and throws an `AppError` with status 403 if the check fails. This single line of middleware, combined with the layered Express routing, means no admin logic can be accidentally reached without both a valid JWT and an admin role — defense in depth at the routing layer.

### Responsive UI Architecture
The frontend uses Tailwind CSS's mobile-first responsive system (sm/md/lg/xl breakpoints) throughout every component. The dashboard layout uses a conditional rendering approach: on mobile, a hamburger button triggers an overlay sidebar (with `document.body.style.overflow = 'hidden'` to prevent background scroll); on desktop, the sidebar is rendered as a permanent fixture. Data tables on admin pages use `overflow-x-auto` containers to enable horizontal scrolling on narrow viewports. All KPI grids use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` patterns for fluid, overflow-free layouts at every breakpoint.

---

## 🛡️ Security & Reliability

Security is treated as a first-class concern at every layer of the GolfForGood stack. The following measures are implemented in the production codebase:

### Authentication Security

All user passwords are hashed using **bcrypt** with a salt factor of 10, meaning plain-text passwords are never stored in the database at any point. Supabase Auth manages the cryptographic lifecycle of credentials, including password reset tokens with time-bounded expiry. JWT tokens are short-lived and validated on every API request via Supabase's public key verification — no database round-trip required for token validation.

### Role-Based Authorization

The platform implements a two-tier authorization model. Tier 1 is authentication — every protected route requires a valid JWT. Tier 2 is role authorization — admin-only routes require `req.user.role === 'admin'`, checked by a dedicated `requireAdmin` middleware that runs after authentication. This layered middleware chain means authorization cannot be bypassed by manipulating the request without also forging a valid JWT, which is cryptographically infeasible.

### Protected Routes — Frontend & Backend

The frontend implements route guards using React Router's `<PrivateRoute>` pattern — unauthenticated users are silently redirected to the login page before any component renders. Admin routes check both authentication state and the `role` field from the Zustand auth store. Critically, these frontend guards are **defence in depth only** — every sensitive operation is re-validated server-side, so bypassing the frontend produces a `401` or `403` from the API regardless.

### Stripe Webhook Verification

The `/api/payments/webhook` endpoint is one of the most sensitive surfaces in the application — it activates subscriptions and triggers downstream effects. Every incoming request is verified using `stripe.webhooks.constructEvent()`, which validates the `Stripe-Signature` header against the raw request body and the `STRIPE_WEBHOOK_SECRET`. The raw body is preserved by configuring Express to skip JSON parsing specifically on this route, ensuring the byte-exact signature check passes. Any request with an invalid or missing signature is rejected with `400 Bad Request` before any business logic executes.

### Input Validation

All API endpoints that accept user input validate payloads using **Zod schemas** on the backend before any database operation is attempted. This means malformed inputs (wrong types, out-of-range values, missing required fields) are caught at the controller layer with descriptive error messages, not at the database constraint layer with cryptic SQL errors. Frontend forms additionally use `react-hook-form` with Zod resolvers for client-side validation, reducing invalid requests before they reach the server.

### File Upload Security

All file upload endpoints restrict accepted MIME types (`image/jpeg`, `image/png`, `image/webp`) and enforce a 5 MB maximum file size using Multer's `fileFilter` and `limits` configuration. Files are never written to disk — they are buffered in memory and uploaded directly to Supabase Storage, eliminating temporary file cleanup risks. Storage bucket policies prevent direct public write access, requiring all uploads to go through the authenticated backend.

### Supabase Row-Level Security

Supabase's built-in Row-Level Security (RLS) policies are enabled as an additional database-layer guard. Even if a misconfigured backend query were to leak data through an unexpected code path, RLS policies ensure that the Supabase service role key can only perform operations explicitly permitted by the policy definitions.

### Error Handling & Information Hiding

The global Express error handler distinguishes between `AppError` instances (operational errors with user-safe messages) and unknown errors (unexpected exceptions). Unknown errors are returned as generic `500 Internal Server Error` responses with no stack traces or implementation details exposed to the client. All errors are logged server-side for debugging without exposing sensitive information in API responses.

### Suspended Account Enforcement

Administrators can suspend user accounts from the admin dashboard. Suspended users are blocked at the `authMiddleware` layer — their JWT remains technically valid, but the database lookup returns a `status: 'suspended'` flag that causes the middleware to reject the request with `403 Forbidden`. Suspension takes effect on the next API request without requiring token invalidation or a logout flow.

| Security Layer | Mechanism | Where Applied |
|---|---|---|
| Password hashing | bcrypt (salt 10) | Registration & auth |
| JWT validation | Supabase cryptographic verification | All protected routes |
| Role authorization | `requireAdmin` middleware | All `/admin` endpoints |
| Subscription guard | `requireActiveSubscription` middleware | Scores, draws, claims |
| Webhook verification | Stripe HMAC-SHA256 signature | `/api/payments/webhook` |
| Input validation | Zod schemas (backend) | All write endpoints |
| File type restriction | Multer MIME filter + size limits | Upload endpoints |
| Row-Level Security | Supabase RLS policies | Database layer |
| Error sanitization | Global error handler | All error responses |
| Account suspension | Middleware status check | All protected routes |

---

## 🧪 Quality & Testing

### TypeScript End-to-End
The project is 100% TypeScript — both frontend and backend. Shared type definitions in `frontend/src/types/index.ts` model every API entity (User, Subscription, Charity, Draw, WinnerClaim, etc.) with full interface declarations. The backend's `env.ts` module validates all environment variables at startup and throws descriptive errors if any required variable is missing, preventing misconfigured deployments from running silently.

### Build Verification
Every change is validated by running `npm run build` in both the frontend and backend directories. The frontend build chain runs `tsc -b` (strict TypeScript compilation) followed by `vite build`. Any type error surfaces as a build failure, preventing broken code from being deployed. The backend TypeScript is compiled with strict mode enabled.

### Stripe Testing
All payment flows are implemented and tested in Stripe's **Test Mode**. The Stripe test card `4242 4242 4242 4242` is used for manual QA. Webhook events are tested locally using the Stripe CLI's `stripe listen --forward-to localhost:3001/api/payments/webhook` command, which replays real Stripe events against the local server.

### Responsive Testing
Mobile responsiveness is verified across six key breakpoints: 320px (iPhone SE), 375px (iPhone X/12 mini), 390px (iPhone 14), 414px (iPhone 14 Plus), 768px (iPad), and 1024px (Desktop). Chrome DevTools Device Toolbar is used to simulate each breakpoint, with visual inspection confirming zero horizontal overflow, tappable buttons (minimum 44px touch target), and accessible form layouts at every size.

### Security Considerations
- All inputs are validated using Zod schemas on the backend before any database interaction.
- SQL injection is prevented by using the Supabase parameterised query API exclusively.
- Webhook payloads are verified using Stripe signature checking before processing.
- File upload endpoints limit MIME types and file sizes to prevent abuse.
- Suspended users are blocked at the JWT validation layer, not just the UI.
- Admin endpoints are double-protected by both JWT and role middleware.

### Error Handling
All errors in the application extend the `AppError` base class, which carries an HTTP status code, a user-facing message, and an operational flag. A global Express error handler catches all thrown `AppError` instances and formats them into consistent JSON responses. Unhandled errors (unexpected exceptions) are caught by the same handler and returned as `500 Internal Server Error` with sanitised messages to avoid leaking implementation details.

---

## 🚀 Installation & Local Setup

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **Supabase** project (free tier sufficient)
- A **Stripe** account (test mode)
- A **Resend** account (free tier sufficient)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/GolfForGood.git
cd GolfForGood
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Copy the example env files and fill in your credentials (see [Environment Variables](#-environment-variables) section):

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 5. Set Up the Database

Run the seed script against your Supabase PostgreSQL instance:

```bash
# Using psql (replace with your Supabase connection string)
psql "postgresql://..." -f backend/demo_seed.sql
```

### 6. Start the Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

### 7. Configure Stripe Webhook (Local)

```bash
# Install Stripe CLI and forward webhooks to your local server
stripe listen --forward-to localhost:3001/api/payments/webhook
```

Copy the webhook signing secret output by the CLI into your `backend/.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-jwt-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL (for Stripe redirect URLs)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ **Never commit `.env` files to version control.** The `.env.example` files contain only placeholder values.

---

## ☁️ Deployment

GolfForGood is deployed on **Render**, which offers zero-configuration Node.js and static site hosting.

### Backend Deployment (Render Web Service)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the **Build Command** to `cd backend && npm install && npm run build`.
4. Set the **Start Command** to `cd backend && npm start`.
5. Add all backend environment variables in the Render dashboard.
6. Add your Render service URL as the webhook endpoint in your Stripe Dashboard.

### Frontend Deployment (Render Static Site)

1. Create a new **Static Site** on Render.
2. Set the **Build Command** to `cd frontend && npm install && npm run build`.
3. Set the **Publish Directory** to `frontend/dist`.
4. Add `VITE_API_URL` pointing to your deployed backend URL.

### Supabase Configuration

Ensure your Supabase project has:
- **Authentication → URL Configuration** set to your production frontend URL.
- **Storage Buckets** created for `charity-images` and `winner-proofs` with appropriate public/private policies.
- **RLS Policies** reviewed and enabled for production.

---

## 🧭 Project Journey

GolfForGood began as a straightforward question: *can a subscription model for amateur golfers also serve a social purpose?* The initial concept was simple — collect monthly fees, give some to charity, run a raffle. But as the engineering reality set in, the complexity compounded beautifully.

**Phase 1 — Core Authentication & User Model:** The first challenge was building a user system that supported both casual email sign-up and seamless Google OAuth, with a role model that could support admin capabilities without a separate admin application. Supabase Auth solved the identity layer elegantly, while a custom `users` table extended the auth record with platform-specific fields.

**Phase 2 — Subscription Architecture:** Designing the subscription lifecycle required modelling not just the current state but the *history* of state transitions. The `subscriptions` table evolved to track start dates, end dates, renewal dates, and Stripe references simultaneously. The auto-expiry logic went through multiple iterations before landing on the lazy evaluation approach implemented in middleware.

**Phase 3 — Stripe Integration:** Adding real payments was the most technically demanding phase. The challenge wasn't the checkout redirect — it was the webhook. Ensuring the webhook handler was idempotent, signature-verified, and correctly mapped Stripe metadata back to platform subscriptions required careful engineering of the data flow between the checkout session creation and the webhook receipt.

**Phase 4 — Charity & Donation System:** The charity selection model — where subscribers pick a cause and set a contribution percentage — was added to give the platform a differentiated emotional hook beyond a standard lottery. The challenge was designing the data model so that subscription revenue could be theoretically split between prize pools and charity allocations without requiring a real-time financial ledger.

**Phase 5 — Draw System:** The draw engine was the most algorithmically interesting feature. The rolling score window, the prize pool allocation across match levels, the jackpot rollover logic, and the winner identification query all required careful domain modelling. The simulate-then-generate workflow was added based on the insight that administrators would want to preview outcomes before committing irreversible state changes.

**Phase 6 — Winner Verification:** Adding the proof upload workflow turned the platform from a notification system into a complete claim management system. This required integrating Supabase Storage for secure file handling, building a drag-and-drop upload UI with file validation, and building an admin review panel with approval and rejection capabilities.

**Phase 7 — Responsive Polish:** The final engineering pass focused entirely on mobile experience — fixing overflow issues, improving touch targets, locking body scroll on mobile drawers, and ensuring every table and form was usable on a 320px iPhone SE screen. The platform was tested across six breakpoints to confirm zero horizontal scrolling at any viewport width.

The result is a platform that demonstrates the full breadth of modern full-stack engineering: real financial infrastructure, cloud storage, event-driven architecture, role-based security, and a polished, accessible UI — all in a single coherent product.

---

## 🔭 Future Enhancements

The following capabilities are planned for future iterations of the platform:

| Feature | Description | Priority |
|---|---|---|
| **Stripe Customer Portal** | Let subscribers manage billing directly via Stripe's hosted portal | High |
| **Real-time Draw Events** | WebSocket-based live draw announcements for active subscribers | High |
| **Automated Charity Payouts** | Stripe Connect integration for direct disbursement to charity bank accounts | High |
| **Score Verification** | Handicap index integration with official golf associations for score validation | Medium |
| **Push Notifications** | Mobile push alerts via web push API for draw results and claim updates | Medium |
| **Leaderboard System** | Public ranking of most charitable subscribers by contribution totals | Medium |
| **Multi-currency Support** | Localised pricing for international market expansion | Medium |
| **Referral Programme** | Subscriber referral codes with subscription credit rewards | Low |
| **Charity Application Portal** | Self-serve onboarding flow for new charities to apply for partnership | Low |
| **End-to-End Testing** | Playwright test suite covering critical user journeys | Low |

---

## 🏅 Key Technical Achievements

> **For recruiters and engineering managers scanning this project:** Below is a 30-second summary of the most technically impressive aspects of this codebase, mapped to real-world engineering competencies.

| Achievement | Technology | What It Demonstrates |
|---|---|---|
| 🏗️ **Full-Stack SaaS Architecture** | React + Node.js + PostgreSQL | End-to-end product ownership from DB schema to UI |
| 💳 **Stripe Checkout Integration** | Stripe API + Hosted Sessions | Third-party payment API integration with real financial workflows |
| 🔔 **Stripe Webhook Automation** | HMAC-SHA256 signature verification | Event-driven architecture, idempotency, async business logic |
| 🔐 **Supabase Auth + Google OAuth** | JWT + OAuth 2.0 | Multi-strategy authentication, token lifecycle management |
| 📧 **Transactional Email System** | Resend API | Non-blocking notification architecture, service layer abstraction |
| 📁 **Cloud File Storage** | Supabase Storage Buckets | Multipart upload handling, CDN-backed media delivery |
| 📊 **Admin Analytics Dashboard** | Custom SQL aggregations | Real-time KPI reporting, multi-entity analytics |
| 🛡️ **Role-Based Access Control** | Express middleware chain | Composable authorization, defence-in-depth security |
| 🎟️ **Automated Draw Engine** | Custom prize pool algorithm | Domain-specific business logic, jackpot rollover mechanics |
| 📱 **Mobile-First Responsive UI** | Tailwind CSS responsive utilities | Cross-device compatibility, accessible component design |
| 🔄 **Subscription Lifecycle Engine** | Middleware + DB state machine | Automatic expiry detection, lazy evaluation without cron jobs |
| 🧠 **TypeScript End-to-End** | tsc strict mode | Full type safety across frontend API, backend services, and DB models |

### Skills Demonstrated by This Project

```
Backend Engineering    ████████████████████  API design, middleware, error handling, validation
Database Design        ████████████████████  Relational modelling, joins, normalisation, RLS
Payment Integration    ████████████████████  Stripe Checkout, Webhooks, idempotency
Authentication         ████████████████████  JWT, OAuth 2.0, RBAC, session management
Frontend Engineering   ████████████████████  React, TypeScript, TanStack Query, Zustand
UI/UX Engineering      █████████████████░░░  Responsive design, Tailwind, Framer Motion
Cloud Infrastructure   █████████████████░░░  Supabase, Render, Storage buckets
Product Thinking       ████████████████████  End-to-end ownership, business logic modelling
```

This project was built entirely solo — from database schema design and API architecture through to Stripe integration, admin dashboards, and mobile-first UI polish — demonstrating the breadth and depth of a senior full-stack engineering skillset.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Please follow these steps:

1. **Fork** the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes following conventional commits: `git commit -m 'feat: add new feature'`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a **Pull Request** with a clear description of the change.

Please ensure:
- All TypeScript errors are resolved (`npm run build` passes).
- New features include appropriate error handling.
- API changes are reflected in this README.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author

<div align="center">

### Madduri Dashwanth

**Full Stack Developer**

*Architected and engineered GolfForGood end-to-end — from database schema design and RESTful API development to React frontend and Stripe payment integration.*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/madduri-dashwanth/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dashwanth15)

---

*Built with ☕, TypeScript, and a genuine belief that technology can make sport more meaningful.*

</div>
