# Omnireply

Omnireply is an omnichannel customer support and AI agent platform. It allows businesses to manage customer interactions across multiple channels (voice, text, web) using intelligent AI agents and automated workflows.

## Features

- **Unified Inbox**: Manage all customer conversations in one place.
- **AI Agents**: Configure and deploy AI voice and text agents using Vapi and OpenAI.
- **AI Calling**: Conduct AI-powered phone calls seamlessly.
- **Omnichannel Support**: Integration with various channels including Twilio.
- **Workflows**: Build automated workflows for customer interactions.
- **Knowledge Base**: Store and manage information for AI agents to retrieve.
- **Analytics & Dashboard**: Monitor agent performance and interaction metrics.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, React Router, Zustand, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Vapi SDK, OpenAI, Twilio.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shaibaank/omnireply.git
   cd omnireply
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. Environment Variables:
   Create a `.env` file in the root directory and add the necessary API keys (e.g., VAPI_API_KEY, OPENAI_API_KEY, TWILIO_ACCOUNT_SID).

### Running the Application

You need to run both the frontend and backend servers.

**Frontend** (Runs on port 5173 by default):
```bash
npm run dev
```

**Backend** (Runs on port 3000 by default):
```bash
cd server
npx ts-node index.ts
```

## License

ISC
