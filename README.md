# Quizy - AI-Powered Quiz Generator

An interactive quiz application that uses Google's Gemini AI to generate role-specific questions.

## Features

- AI-powered quiz generation
- Multiple choice questions
- Real-time scoring
- Role-specific content
- Modern UI with Tailwind CSS

## Setup

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Quizy.git
```

2. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Configure environment variables:

- Copy `.env.example` to `.env` in the server directory
- Add your Gemini API key

4. Start the development servers:

Server:

```bash
cd server
npm run dev
```

Client:

```bash
cd client
npm run dev
```

## Technologies

- Frontend: React, Tailwind CSS, Vite
- Backend: Node.js, Express
- AI: Google Gemini AI

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
