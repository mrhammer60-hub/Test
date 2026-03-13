# 🏋️ IronCoach Platform

**Production-ready multi-tenant SaaS platform for bodybuilding & resistance-training coaches.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](package.json)

---

## 🚀 Live Demo

> **Quick Access Credentials:**
> | Role | Email | Password |
> |------|-------|----------|
> | 👑 Super Admin | `admin@ironcoach.com` | `password123` |
> | 🏋️ Coach | `ahmed@coach.com` | `password123` |
> | 👤 Trainee | `omar@trainee.com` | `password123` |

---

## ✨ Features

### 👑 Super Admin
- Platform dashboard with MRR/ARR metrics
- Coach management (approve, suspend, view details)
- Global exercise library management
- Revenue & billing dashboard (Stripe)
- Support inbox with real-time chat
- Announcement broadcasting
- Platform settings & configuration
- Full audit logs

### 🏋️ Coach Dashboard
- Trainee roster management with seat limits
- Drag-and-drop workout plan builder
- Nutrition/meal plan creator with macro calculator
- Progress analytics & adherence tracking
- Real-time 1:1 chat with trainees
- Brand customization (logo, subdomain, bio)
- Stripe subscription management
- Admin support chat

### 👤 Trainee App
- Daily workout with set logging & timers
- Meal plan with macro ring tracker
- Body measurements timeline
- Progress photos (before/after)
- Weight trend charts
- Real-time coach chat
- Weekly schedule view
- Profile & notification settings

---

## 🏗️ Full Tech Stack (Blueprint)

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 14 (App Router) |
| Mobile | React Native / Expo SDK 51 |
| Backend API | Node.js + Fastify |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis (Upstash) |
| Payments | Stripe Subscriptions |
| Real-time Chat | Socket.io |
| Storage | Cloudflare R2 + CDN |
| Email | Resend + React Email |
| Push Notifications | Expo Push (FCM + APNs) |
| Auth | JWT + bcrypt |
| Web Hosting | Vercel |
| API Hosting | Railway / Fly.io (Docker) |
| i18n | next-intl (Arabic RTL + English) |

---

## 💰 Pricing Model

| Plan | Trainees | Price |
|------|----------|-------|
| Starter | Up to 20 | $60/month |
| Growth | Up to 50 | $100/month |
| Pro | Up to 150 | $200/month |

**Potential ARR with 1,000 coaches:** $360k–$2.4M

---

## 🚦 Getting Started

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/ironcoach-platform.git
cd ironcoach-platform

# Install
npm install

# Start dev server
npm start

# Build for production
npm run build
```

---

## 📂 Project Structure

```
ironcoach-platform/
├── public/
│   └── index.html
├── src/
│   ├── index.js          # React entry point
│   └── IronCoach.jsx     # Full platform (single-file demo)
├── package.json
├── .gitignore
└── README.md
```

### Production Architecture (Monorepo)
```
ironcoach/
├── apps/
│   ├── web/              # Next.js 14 — Admin, Coach, Trainee portals
│   ├── mobile/           # Expo React Native — Trainee app
│   └── api/              # Fastify REST API
├── packages/
│   ├── db/               # Prisma schema + migrations
│   ├── shared/           # TypeScript types, constants, zod schemas
│   └── ui/               # Shared React components
└── infra/                # Docker, environment templates
```

---

## 🗄️ Database Schema (24+ Tables)

```
users · coaches · trainees · body_assessments · calorie_calculations
exercises · workout_plans · workout_days · workout_exercises · workout_logs
exercise_set_logs · meal_plans · meals · foods · conversations · messages
notifications · push_tokens · refresh_tokens · support_tickets · audit_logs
platform_settings · progress_photos
```

---

## 🔐 Security

- JWT access tokens (15min) + refresh tokens (7 days)
- Role-based access control (RBAC)
- Tenant isolation enforced at DB query level (coach_id filtering)
- bcrypt password hashing
- Stripe webhook signature verification
- Rate limiting per tenant

---

## 🌍 Internationalization

- Arabic (RTL) + English support
- `next-intl` for Next.js web app
- `I18nManager.forceRTL()` for Expo mobile
- Bilingual exercise names, meal names, and UI

---

## 📱 MVP Roadmap

| Phase | Timeline | Deliverables |
|-------|----------|-------------|
| 1 — Foundation | Weeks 1–4 | Auth, DB schema, Stripe, Coach/Trainee onboarding |
| 2 — Core Features | Weeks 5–10 | Exercise library, Workout builder, Nutrition, Progress |
| 3 — Communication | Weeks 11–14 | Socket.io chat, Push notifications, Email |
| 4 — Mobile + Polish | Weeks 15–20 | React Native app, Arabic RTL, App Store submission |

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

**Built with ❤️ for the fitness coaching industry · Arabic + English · Mobile-first**
