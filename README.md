# 🌀 Team Flow — AI-Powered Team Communication Platform

> *Slack, but smarter. Built with Next.js, Realtime, and AI — from scratch.*

Team Flow is a full-stack B2B SaaS communication platform designed for modern teams. It supports workspaces, channels, real-time messaging, threaded conversations, emoji reactions, image uploads, and powerful AI features like message rewriting and thread summarization — all wrapped in a secure, scalable architecture.

Built using industry-standard tools and best practices, this project demonstrates how to create a production-ready SaaS app with authentication, billing, real-time sync, and AI integration — without relying on third-party chat APIs.

---

## 🌟 Core Features

✅ **User Authentication & Organizations**  
— Sign up via Email, Google, or GitHub (powered by Kinde)  
— Create and manage multiple workspaces & invite teammates  

✅ **Real-Time Messaging**  
— Instant message delivery using Cloudflare Durable Objects  
— Emoji reactions 😍👍🎉  
— Edit messages after sending  
— Reverse infinite scroll for smooth history loading  

✅ **Threaded Conversations**  
— Start side discussions on any message  
— Keep main channels clean and organized  

✅ **AI Assistant Tools**  
— **AI Composer**: Fix grammar, rewrite tone, enhance clarity with one click  
— **Thread Summarizer**: Get key takeaways from long conversations instantly  

✅ **Billing & Subscriptions**  
— Free / Pro ($15/user) / Enterprise plans  
— Self-serve customer portal via Kinde + Stripe  

✅ **Media & Collaboration**  
— Secure image uploads using UploadThing (presigned URLs)  
— Real-time presence indicators (see who’s online)  

✅ **Security & Performance**  
— Arcjet WAF: Blocks XSS, SQL injection, bots, and abuse  
— Rate limiting per user/IP  
— Multi-layered authorization for data safety  
— Optimized data fetching and caching  

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- **Next.js 15** (App Router, Server Components, Streaming)
- **React** + **TypeScript**
- **Tailwind CSS** + **Shadcn UI** (Beautiful, accessible components)
- **React Hook Form** + **Zod** (Form handling & validation)

### 🧠 Backend & Realtime
- **Cloudflare Durable Objects** (Real-time sync without WebSockets)
- **oRPC** (Type-safe API layer between client and server)
- **Server Actions** + **Route Handlers**

### 🗃️ Database & ORM
- **Neon Postgres** (Serverless, branching-enabled PostgreSQL)
- **Prisma ORM** (Type-safe queries, migrations, relations)

### 🔐 Auth & Billing
- **Kinde** (OAuth, Magic Links, Organizations, Subscription Management)
- **Stripe** (via Kinde — no direct integration needed)

### 🛡️ Security
- **Arcjet** (Web Application Firewall, Bot Protection, Rate Limiting)

### ☁️ File Uploads
- **UploadThing** (Image uploads with presigned URLs)

### 🚀 Deployment
- **Vercel** (Zero-config deploy, Edge Functions, Preview Deployments)

---

## 📦 Getting Started Soon

Setup instructions, env variables, and local run guide coming soon as development progresses.

---

## 🧑‍💻 Built By

- **Abrar Ali** — abrarali.se@gmail.com
- **Saad Ali** — itmesaad@gmail.com


---

## 📜 License

MIT — Feel free to learn, fork, or adapt for personal or educational use.
