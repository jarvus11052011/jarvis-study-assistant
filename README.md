# JARVIS – Personal AI Study Assistant

A full-stack Next.js application serving as a personal AI study companion for Class 10 CBSE preparation.

## Features

- **AI Chat Tutoring** – Get instant help with any CBSE subject
- **Voice Conversation** – Talk naturally with JARVIS using speech recognition
- **Smart Quizzes** – AI-generated quizzes tailored to your weak topics
- **Study Session Tracking** – Track every study session with timer
- **Progress Dashboard** – Visualize subject-wise progress and streaks
- **Goal Setting** – Set board percentage targets and daily study goals
- **Daily Study Plans** – AI-generated daily plans based on your progress
- **Mobile Responsive** – Fully responsive for phone and desktop

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- PostgreSQL with Prisma ORM (14 models)
- NextAuth.js v5 (credentials + JWT sessions)
- AI Brain: Zaro API (primary) / OpenAI (fallback)
- Voice: Deepgram (STT) + ElevenLabs (TTS) + Web Speech API (browser fallback)
- Charts: Recharts

## Quick Start

```bash
npm install
cp .env.example .env.local  # Fill in your values
npx prisma generate && npx prisma db push
npm run dev
```

Open http://localhost:3000

## Environment Variables

```
DATABASE_URL="postgresql://..."  # PostgreSQL connection
AUTH_SECRET="..."                # openssl rand -base64 32
ZARO_API_KEY="..."              # Your Zaro API key
```

Voice keys (Deepgram, ElevenLabs) are optional – falls back to browser speech API.

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

Get a free PostgreSQL database at [neon.tech](https://neon.tech)

## For Sangeeta

1. Register an account
2. Chat with JARVIS about your studies
3. Use voice mode for hands-free learning
4. Take quizzes after each chapter
5. Track progress and build streaks
6. Set goals like board percentage targets
