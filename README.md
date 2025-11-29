# qbazz-web

Modern e-commerce web application built with React, TypeScript, and Vite. Frontend for the qbazz platform.

## Features

- 🛍️ Product browsing and search
- 🏪 Store listings and profiles
- 📱 Responsive design
- 🤖 AI-powered chat assistance (Google Gemini)
- 🎨 Modern UI components
- ⚡ Fast performance with Vite

## Tech Stack

- **React** 19.1.1
- **TypeScript** 5.8.2
- **Vite** 6.2.0
- **Google Gemini AI** integration

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API endpoints

# Start dev server
npm run dev
```

Visit http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

## Environment Variables

```env
VITE_API_BASE=https://qbazz.runflare.run
GEMINI_API_KEY=your_key_here
```

## Project Structure

```
qbazz-web/
├── components/       # Reusable UI components
├── pages/           # Page components
├── services/        # API client and services
├── hooks/           # Custom React hooks
├── context/         # React context providers
├── public/          # Static assets
├── types.ts         # TypeScript definitions
└── App.tsx          # Main application
```

## API Integration

Connects to qbazz-core backend:

- Base URL configured via `VITE_API_BASE`
- RESTful API communication
- Type-safe API client

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Runflare.

### Quick Deploy to Runflare

1. Push to GitHub
2. Create ReactJS service in Runflare
3. Configure build:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node Version: `20.x`
4. Set environment: `VITE_API_BASE=https://qbazz.runflare.run`
5. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Related Projects

- [qbazz-core](https://github.com/skinny-dev/qbazz-core) - Backend API
- qbazz-telegram-bot - Telegram integration

## Support

- Backend API: https://qbazz.runflare.run
- API Health: https://qbazz.runflare.run/health
