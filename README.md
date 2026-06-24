<div align="center">

# ⛳ GolfForGood

**A subscription-based golf charity platform — play golf, support charities, win prizes.**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Deployed on Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)

</div>

---

## 🚀 Live Demo

🌐 **Frontend:** [https://golfforgood-platform.onrender.com](https://golfforgood-platform.onrender.com)

### 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@golfforgood.com` | `Admin@GolfForGood2026` |

> Stripe payments use test card `4242 4242 4242 4242` — no real charges.

---

## 📌 Project Overview

GolfForGood is a full-stack SaaS platform where golfers subscribe, submit their scores, and automatically enter monthly prize draws — while a portion of their subscription goes to a charity they choose. It combines **subscription billing**, **charitable giving**, and **competitive draws** into one cohesive product.

- Users register, purchase a subscription (monthly or yearly), and select a charity
- Their 5 most recent golf scores become their monthly draw entry numbers
- A percentage of each subscription fee is allocated to their chosen charity
- Monthly draws are run by admins — winners are identified automatically
- Winners upload proof of identity and claim their prizes through a verified workflow
- Admins manage every aspect of the platform through a dedicated dashboard

---

## 📸 Screenshots

### 🏠 Landing Page

![Landing Page](./frontend/src/assets/landing%20page.png)

Public marketing page showcasing the GolfForGood concept, subscription plans, and call-to-action.

---

### 📊 User Dashboard

![User Dashboard](./frontend/src/assets/user%20dashboard.png)

Personalised subscriber dashboard with KPI cards for subscription status, scores, draws, and charity contributions.

---

### ⛳ Golf Score Tracking

![Golf Scores](./frontend/src/assets/golf.png)

Golf score submission interface with rolling 5-score window — each score becomes a monthly draw entry number.

---

### 🏥 Charity Selection

![Charity Selection](./frontend/src/assets/charity%20selection.png)

Charity directory with category filters, featured listings, and contribution percentage settings.

---

### 💳 Subscription & Stripe Checkout

![Subscription Page](./frontend/src/assets/subscription%20page.png)

Plan selection and Stripe-hosted checkout flow — monthly and yearly subscriptions with automatic activation.

---

### ⚙️ Admin Dashboard

![Admin Dashboard](./frontend/src/assets/admin%20dashboard.png)

Full back-office management: user control, draw administration, winner claims, charity management, and platform analytics.

---


## ✨ Key Features

### 🔐 Authentication
- Email/password registration and login
- Google OAuth (one-click sign-in via Supabase)
- JWT-based session management
- Role-based access control (Subscriber / Admin)
- Suspended account enforcement

### 💳 Subscription Management
- Monthly and yearly subscription plans
- Stripe Checkout for secure payment processing
- Stripe Webhooks for automatic subscription activation
- Active / Expired / Cancelled lifecycle states
- Auto-expiry detection via middleware

### 💰 Stripe Payments
- Hosted Stripe Checkout (PCI DSS compliant)
- Webhook signature verification (`HMAC-SHA256`)
- Idempotent webhook handling
- Payment success and cancellation flows

### 🏥 Charity System
- Charity directory with categories and featured listings
- Subscribers select a charity and set a contribution percentage (min 10%)
- One-time direct donations supported
- Charity analytics (total raised, donor count)
- Admin charity management with image uploads

### ⛳ Golf Score Tracking
- Submit golf scores (values 1–45)
- Rolling 5-score window (oldest auto-removed on 6th entry)
- Scores become monthly draw entry numbers
- Score history with date tracking

### 🎟️ Draw Management
- Admin creates monthly draws with total revenue
- Simulate → Generate numbers → Publish workflow
- Prize pools allocated across match levels (3, 4, 5 matches)
- Jackpot rollover for unmatched prizes
- All active subscribers notified on publish

### 🏆 Winner Claims
- Winners identified automatically on draw publish
- Proof of identity upload (image, max 5MB)
- Admin review → Approve / Reject with notes
- Payment tracking (pending → paid)
- Full audit trail from draw to payment

### 🛡️ Admin Dashboard
- Full user management (view, edit, suspend, manage scores)
- Subscription management (status updates, cancellation, reactivation)
- Charity management (CRUD + media uploads)
- Draw management (create, simulate, generate, publish)
- Winner claims review and processing
- Platform analytics and KPI dashboards

### 📧 Email Notifications
- Subscription activation emails
- Draw publication emails to all subscribers
- Winner alert emails
- Claim approval and rejection emails
- Powered by Resend — non-blocking architecture

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **State Management** | TanStack Query, Zustand, React Hook Form + Zod |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth, Google OAuth, JWT |
| **Storage** | Supabase Storage (charity images, winner proofs) |
| **Payments** | Stripe Checkout + Stripe Webhooks |
| **Email** | Resend |
| **Deployment** | Render (frontend + backend) |

---

## 🏗️ Architecture Overview

```
React Frontend (Vite + TypeScript)
        ↓
Express.js REST API (Node.js + TypeScript)
        ↓
Supabase PostgreSQL (Database + Auth + Storage)
        ↓
Stripe (Checkout Sessions + Webhooks)
        ↓
Resend (Transactional Emails)
```

The frontend communicates with the backend via a typed REST API. The backend handles all business logic, authentication middleware, and third-party integrations. Supabase serves as the database, auth provider, and file storage layer.

---

## 🗄️ Database Overview

| Table | Purpose |
|-------|---------|
| `users` | User profiles, roles, and account status |
| `subscription_plans` | Available plans (monthly/yearly) with Stripe price IDs |
| `subscriptions` | User subscription records and lifecycle state |
| `charities` | Charity directory with categories and media |
| `user_charity_selections` | User's selected charity and contribution percentage |
| `user_scores` | Golf scores (rolling 5-score window per user) |
| `draws` | Monthly draw records and winning numbers |
| `prize_pools` | Prize allocation per match level per draw |
| `draw_entries` | User participation records per draw |
| `winner_claims` | Claim records with proof upload and review status |
| `donations` | Charitable giving records (subscription splits + direct) |

---

## ⚙️ Key Technical Highlights

- **Stripe Webhook Security** — HMAC-SHA256 signature verification on every webhook event before processing
- **Automatic Subscription Activation** — Stripe webhook triggers subscription creation and email notification without manual intervention
- **Google OAuth** — One-click sign-in via Supabase Auth with seamless platform user creation
- **JWT Middleware** — Every protected route validates the token and attaches the full user record server-side
- **Role-Based Access Control** — Composable `requireAdmin` middleware guards all admin endpoints independently of the frontend
- **Supabase Storage** — In-memory multipart uploads streamed directly to cloud storage (no temp files on disk)
- **Auto-Expiry Detection** — Subscription expiry is detected lazily in middleware on each request, no cron jobs required
- **Responsive UI** — Mobile-first design tested at 320px, 375px, 390px, 768px, and 1024px breakpoints
- **Input Validation** — Zod schemas on both frontend (React Hook Form) and backend (controller layer)
- **Non-blocking Emails** — Email failures never roll back database transactions or payment activations

---

## 🚀 Installation

```bash
# 1. Clone the repo
git clone https://github.com/Dashwanth15/golfforgood-platform.git
cd golfforgood-platform

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Configure environment variables (see below)

# 4. Run database seed
psql "YOUR_SUPABASE_CONNECTION_STRING" -f backend/demo_seed.sql

# 5. Start development servers
cd backend && npm run dev      # http://localhost:3001
cd frontend && npm run dev     # http://localhost:5173
```

---

## 🔐 Environment Variables

**Backend `.env`**
```env
PORT=3001
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
FRONTEND_URL=
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🔭 Future Enhancements

- [ ] Stripe Customer Portal for self-serve billing management
- [ ] Real-time draw announcements via WebSockets
- [ ] Automated charity payouts via Stripe Connect
- [ ] Golf handicap index integration for score verification
- [ ] Mobile push notifications for draw results
- [ ] Subscriber referral programme with credit rewards
- [ ] Charity self-onboarding portal
- [ ] End-to-end testing with Playwright

---

## 💼 What This Project Demonstrates

- **Full-Stack Development** — End-to-end ownership from DB schema to polished UI
- **SaaS Architecture** — Subscription billing, lifecycle management, and multi-role access
- **Payment Integration** — Stripe Checkout, Webhooks, and idempotent event processing
- **Authentication Systems** — JWT, Google OAuth, role-based authorization
- **Cloud Infrastructure** — Supabase (DB + Auth + Storage), Render deployment
- **Database Design** — 11-table relational schema with normalised relationships
- **API Development** — RESTful Express.js API with layered middleware architecture
- **Product Thinking** — Business logic modelling, user workflows, and admin tooling

---

## 👨‍💻 Author

**Madduri Dashwanth** — Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-Dashwanth15-181717?style=flat-square&logo=github)](https://github.com/Dashwanth15)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-madduri--dashwanth-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/madduri-dashwanth/)

---

<div align="center">

*Built with TypeScript, Stripe, Supabase, and a lot of ☕*

</div>
