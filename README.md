# AI Customer Support System 🤖

This project is a full-stack AI-powered customer support system that uses multiple specialized agents (Support, Order, Billing) to handle user queries intelligently.

Instead of a single chatbot, the system routes each message to the most suitable agent and maintains conversation context across messages. The goal is to simulate a real-world customer support workflow in a clean, reliable way.

---

## ✨ Key Features

- Multi-agent architecture (Support, Order, Billing)
- Intelligent routing based on user intent
- Persistent conversation state (agent does not reset randomly)
- Database-backed conversations and messages
- Clean and simple chat UI
- No hallucinated intent (agents respond only to what user asks)
- Frontend and backend fully separated
- Production-style architecture (controller, service, agents, tools)

---

## 🧠 How the System Works (High Level)

1. User sends a message from the frontend
2. Backend receives the message with a `conversationId`
3. A router decides **which agent** should handle the message
4. The selected agent generates a response using context + rules
5. The response is saved to the database
6. Frontend displays only the assistant’s reply (not raw JSON)

Each conversation remembers:
- which agent is currently active
- previous messages
- conversation state

---

## 🏗️ Architecture Overview

### Backend (Node.js + TypeScript)

