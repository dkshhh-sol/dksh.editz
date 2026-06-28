DKSH — Video Editor & Motion Designer Portfolio
A cinematic, motion-driven portfolio site for DKSH, a freelance video editor and motion designer. Built to showcase high-retention edits, cinematic color grading, and motion graphics — with every interaction designed to feel like a film, not a webpage.

🔗 Live: https://dksh-editz.vercel.app

✨ Overview
This is a single-page, scroll-driven portfolio engineered for impact. From the animated loader to the boomerang video hero and the custom cursor, the site is built to hold attention the same way a good edit does — every frame placed with intent.

It's powered by TanStack Start (full-stack React framework) with server-side rendering, React 19, Tailwind CSS v4, and Framer Motion for animation.

🎬 Features
Animated intro loader — a gated entrance that locks scroll until the experience is ready
Custom cursor — bespoke pointer interactions replacing the default cursor
Smooth scrolling — buttery inertia-based scroll powered by Lenis
Boomerang video hero — a looping, ping-pong video background rendered to canvas for a seamless cinematic loop
YouTube-powered showreel — ambient and controlled YouTube playback for embedded reels
Animated type & roles — rotating job titles (Video Editor · Motion Designer · Visual Storyteller)
Animated stat counters — count-up metrics (200+ videos, clients, etc.)
Work / project showcase — curated edit reels and case highlights
Client testimonials — social proof from real creators
Contact section — direct path to start a project
Fully responsive — mobile-aware layouts and interactions
SSR + SEO ready — server-rendered with Open Graph and Twitter card metadata
🛠 Tech Stack
Layer	Technology
Framework	TanStack Start + TanStack Router
UI Library	React 19
Build Tool	Vite 8
Server / Deploy	Nitro (Cloudflare-target by default)
Styling	Tailwind CSS v4
Components	Radix UI primitives (shadcn-style, in src/components/ui)
Animation	Framer Motion · Lenis (smooth scroll) · tw-animate-css
Data	TanStack Query
Forms & Validation	React Hook Form · Zod
Icons	Lucide React
Toasts	Sonner
Language	TypeScript
🚀 Getting Started
Prerequisites
Node.js 18+ (Node 20+ recommended)
npm (or bun)
Installation

# Clone the repository
git clone https://github.com/dkshhh-sol/dksh.editz.git
cd dksh.editz

# Install dependencies
npm install

# Start the dev server
npm run dev
The dev server runs at http://localhost:8080 (falls back to the next free port if taken).

📜 Scripts
Command	Description
npm run dev	Start the development server with HMR
npm run build	Production build (Nitro server + static output)
npm run build:dev	Build in development mode
npm run preview	Preview the production build locally
npm run lint	Run ESLint
npm run format	Format the codebase with Prettier
📁 Project Structure

src/
├── assets/             # Video & image assets (hero background, client logos)
├── components/         # Page sections & feature components
│   ├── ui/             # Reusable Radix/shadcn-style primitives
│   ├── hero.tsx        # Headline hero with rotating roles
│   ├── quietpress-hero.tsx  # Boomerang canvas video background
│   ├── work.tsx        # Project / reel showcase
│   ├── about.tsx       # Bio + animated stat counters
│   ├── skills.tsx      # Skills & tooling
│   ├── clients.tsx     # Testimonials
│   ├── contact.tsx     # Contact / start-a-project
│   ├── loader.tsx      # Animated intro loader
│   ├── cursor.tsx      # Custom cursor
│   └── smooth-scroll.tsx    # Lenis smooth-scroll wrapper
├── routes/             # TanStack Router file-based routes
│   ├── __root.tsx      # Root layout + global <head> meta
│   └── index.tsx       # Home page composition
├── hooks/              # Custom React hooks
├── lib/                # Utilities (YouTube helpers, error capture)
├── router.tsx          # Router configuration
└── styles.css          # Tailwind v4 global styles
🌐 Deployment
The build is produced by Nitro and targets Cloudflare by default:


npm run build
npx nitro deploy --prebuilt
Nitro supports multiple presets (Vercel, Netlify, Node, etc.) — adjust the target as needed for your host.

📄 License
This project is private and proprietary. All rights reserved © DKSH.

"High-retention edits, cinematic color, and motion graphics for creators. Every frame placed with intent, every cut earning the next second."
