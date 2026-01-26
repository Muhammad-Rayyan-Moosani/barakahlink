# BarakahLink

> *Connecting surplus food with local need through blessing and community.*

A modern, AI-powered platform bridging the gap between food donors and recipients in the Kitchener-Waterloo region.

---

## ✨ Overview

BarakahLink enables restaurants, bakeries, and community members to share surplus food with those who need it most. The platform combines elegant design with intelligent AI moderation to create a simple, dignified food-sharing experience.

### Key Features

- **🗺️ Interactive Map** — Real-time visualization of available food drops with location-based filtering
- **🤖 AI Moderation** — Gemini-powered content analysis for safety and automatic dietary tag generation
- **📱 SMS Access** — Text-based interface for users without smartphone apps
- **👥 Dual User Modes** — Separate interfaces for donors and recipients
- **🏷️ Smart Tagging** — Automatic categorization (Halal, Vegan, Gluten-Free, etc.)
- **⏰ Time-Based Availability** — Visual countdown showing pickup window urgency

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (optional — app works with fallback mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/barakahlink.git
cd barakahlink

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Gemini API key (optional)
# VITE_GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running locally.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project" and select your repository
   - Vercel auto-detects Vite configuration

3. **Configure Environment** (Optional)
   - Add `VITE_GEMINI_API_KEY` in Vercel dashboard
   - Navigate to: Settings → Environment Variables

4. **Deploy**
   - Click "Deploy" and wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Build Configuration

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS |
| **Build Tool** | Vite |
| **Maps** | Leaflet.js + OpenStreetMap |
| **AI** | Google Gemini API |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
barakahlink/
├── src/
│   ├── components/        # React components
│   │   ├── AuthView.tsx   # Authentication interface
│   │   ├── Button.tsx     # Reusable button component
│   │   ├── DonorDashboard.tsx
│   │   ├── FoodCard.tsx   # Food drop card display
│   │   ├── Logo.tsx       # Brand logo with animations
│   │   ├── MapView.tsx    # Leaflet map integration
│   │   ├── Navbar.tsx     # Global navigation
│   │   └── SMSView.tsx    # SMS interface simulation
│   ├── services/
│   │   └── geminiService.ts  # AI content analysis
│   ├── backend/
│   │   ├── mockBackend.ts    # In-memory data layer
│   │   └── types.ts          # TypeScript interfaces
│   ├── constants.ts       # Configuration constants
│   ├── App.tsx            # Root component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

---

## 🎨 Design Philosophy

BarakahLink embodies a **"celestial glass"** aesthetic combining:

- **Cultural Resonance** — Islamic geometric motifs (8-pointed Khatam star, crescent moon)
- **Modern Glassmorphism** — Backdrop blur, transparency, and depth
- **Warm Color Palette** — Emerald greens (growth) and amber golds (warmth)
- **Sophisticated Typography** — Serif headlines with tight tracking, uppercase micro-labels
- **Premium Interactions** — Smooth animations, hover glows, scale transforms

### Core Values

1. **Dignity** — No stigma, no barriers, just community support
2. **Simplicity** — Clean interface, minimal friction
3. **Trust** — AI moderation ensures appropriate content
4. **Accessibility** — SMS fallback for users without apps

---

## 🔑 Key Components

### AI-Powered Content Analysis

```typescript
// Automatic safety checks and tag extraction
const analysis = await analyzeFoodDescription(description);

// Returns:
{
  isAppropriate: true,
  tags: ['Vegan', 'Halal', 'Bakery'],
  summary: 'Fresh sourdough loaves from local bakery...'
}
```

### Dual User Modes

- **Recipients** — Browse map, filter by dietary needs, reserve pickups
- **Donors** — Create listings, manage donations, view claimant details

### Time-Based Urgency

Visual progress bars show remaining pickup window, helping users prioritize time-sensitive food.

---

## 🌍 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key for AI features |

**Note:** App functions without API key using fallback responses.

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript** — Strict mode with comprehensive type definitions
- **Component Documentation** — JSDoc comments on all interfaces and functions
- **CSS Architecture** — Tailwind utility classes with custom design tokens

---

## 📝 License

MIT License — feel free to use this project as a template or inspiration for your own community platforms.

---

## 🙏 Acknowledgments

- **OpenStreetMap** for map data
- **Leaflet.js** for map rendering
- **Google Gemini** for AI capabilities
- **Tailwind CSS** for styling framework
- **Anthropic Claude** for development assistance

---

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please open an issue or reach out via GitHub.

---

<div align="center">

**BarakahLink** • *Share the Meal* • 2026

Made with 💚 for the Kitchener-Waterloo community

</div>