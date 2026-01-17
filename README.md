# AI Customer Support System 🤖

A multi-agent AI-powered customer support system that intelligently routes user queries to specialized agents — **Support**, **Order**, and **Billing** — while preserving conversation context using PostgreSQL.

This project is designed as a **real-world full-stack system**, focusing on clean architecture, reliability, and separation of concerns rather than a single chatbot demo.

---

## 🚀 Features

- 🧠 Multi-agent architecture (Support / Order / Billing)
- 🔁 Conversation context persistence
- 🗄️ PostgreSQL-backed message and state storage
- 🧩 Clear backend layering (Controller → Service → Router → Agent)
- 🪟 Simple and clean React chat UI
- 🛡️ Safe intent handling (no hallucinated intent)
- ⚙️ Modular and extensible design

---

## 🏗️ Architecture

The system is split into **Frontend**, **Backend**, and **Database**, each with a well-defined responsibility.

Backend
├── app.ts                     Entry point
├── routes.ts                 API route definitions
├── controllers/
│   └── chat.controller.ts    HTTP handling
├── services/
│   └── chat.service.ts       Conversation orchestration
├── agents/
│   ├── router.agent.ts       Router selector
│   ├── support.agent.ts      Support logic
│   ├── order.agent.ts        Order logic
│   └── billing.agent.ts      Billing logic
├── tools/                    Database access
│   ├── conversation.tool.ts
│   ├── order.tool.ts
│   └── billing.tool.ts
└── db/
    └── prisma.ts             Prisma client

Frontend
├── src/
│   ├── App.tsx               Main chat UI
│   ├── chat.api.ts           API calls
│   ├── types/
│   │   └── chat.ts           Message types
│   └── components/
│       ├── ChatWindow.tsx
│       ├── ConversationList.tsx
│       └── MessageInput.tsx
└── main.tsx                  React entry point

## 📦 Requirements

Before running the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (or yarn)
- **PostgreSQL**
- **Git**
- **OpenAI API Key**

---

## 🗄️ PostgreSQL Setup

### 1️⃣ Install PostgreSQL

**macOS (Homebrew)**
```bash
brew install postgresql
```
Ubuntu
```
sudo apt install postgresql postgresql-contrib
```

###2️⃣ Create Database
```
psql postgres
```

###3️⃣ Environment Variables
```
DATABASE_URL="postgresql://username:password@localhost:5432/ai_support_system"
OPENAI_API_KEY="your_openai_api_key"
```

###4️⃣ Prisma Setup
```
cd backend
npm install
npx prisma generate
npx prisma migrate dev
```
This will create all required tables in PostgreSQL.

###🚀 Running the Backend
```
cd backend
npm run dev
```

###🎨 Running the Frontend
```
cd frontend
npm install
npm run dev
```

###🔁 End-to-End Flow
User sends a message from the frontend
Backend receives the request via /chat/messages
Router selects the correct agent
Agent generates a response
Conversation state and messages are saved to PostgreSQL
Frontend displays the assistant reply
