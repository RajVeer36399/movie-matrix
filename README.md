# Movie Matrix — Movie Discovery Platform

A fast and modern movie discovery platform built with React + Vite, powered by a custom TMDb caching proxy for speed and reliability.

🌐 Live Demo: https://moviematrixlive.netlify.app/

# Features

🔍 Instant Search — Search movies by title or description

🎭 Genre, Year & Sort Filters

❤️ Add/Remove Favorites (LocalStorage persistence)

📄 Movie Detail Modal

🚀 Fast Grid Rendering using React memoization

🖼️ Lazy-Loaded Images

📱 Fully Responsive UI

🔧 Custom TMDb Proxy Backend (No direct API calls from frontend)

⚡ Optimized for performance (Lighthouse checked)

🔎 SEO + Open Graph meta tags

# Tech Stack
# Frontend
  
  React 18
  
  Vite
  
  TailwindCSS
  
  Lucide Icons
  
  LocalStorage
  
  Custom Hooks + Context API

# Backend (via separate repo)

  Node.js

  Express
  
  TMDb API
  
  JSON cache storage
  
  CORS handled
  
  🔌 API Setup
  

# The frontend uses an environment variable:

  VITE_API_BASE=https://your-proxy-url.onrender.com


Do NOT commit .env.

# Running Locally
npm install
npm run dev

# Build & Deploy
npm run build


# Deploy the dist/ folder to Netlify.
