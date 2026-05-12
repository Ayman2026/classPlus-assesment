# GreetWish — Custom Greetings & Wishes App

> Create stunning personalized greeting cards in seconds and share joy with the world.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite) ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Storage%20%7C%20Firestore-FFCA28?logo=firebase) ![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss)

---

## Project Overview

GreetWish is a modern web application that enables users to create **personalized greeting cards and wishes**. Users can:

- **Log in** via Google, Email, or Guest mode
- **Set up a profile** with their name and photo
- **Browse templates** organized by categories (Birthday, Anniversary, Diwali, Eid, Christmas, Shayari, Jokes, Motivational)
- **See live previews** of templates with their photo and name overlaid
- **Customize and download** cards as PNG images using HTML5 Canvas
- **Share cards** via WhatsApp, native share sheet, or direct download

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18 | UI framework |
| **Vite** | 6 | Build tool & dev server |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **Firebase Auth** | 11 | Google, Email/Password, Anonymous login |
| **Firebase Firestore** | 11 | User profile storage |
| **Firebase Storage** | 11 | Profile picture uploads |
| **React Router** | 6 | Client-side routing |
| **Zustand** | 5 | Lightweight state management |
| **Framer Motion** | 11 | Page transitions & animations |
| **Lucide React** | — | Icon library |
| **react-hot-toast** | 2 | Toast notifications |
| **HTML5 Canvas API** | — | Image compositing & overlay rendering |
| **Web Share API** | — | Native mobile sharing |

---

## Features

### Authentication
- Google Sign-In (OAuth)
- Email / Password authentication
- Guest / Anonymous login
- Profile setup with name & photo upload

### Home Page
- Category filter bar (horizontal scroll pills)
- Responsive masonry-style grid (2/3/4 columns)
- "Trending Today" section
- Free / Premium badges on each template
- Live user avatar & name overlay on every card

### Card Editor
- HTML5 Canvas rendering engine
- Background image with cover-fit
- Circular profile picture with green ring border
- Display name overlay
- Quote text with word-wrap at bottom
- Download as PNG
- Share via WhatsApp / native share / clipboard

### Premium Flow
- Premium modal with plan cards (Monthly / Yearly / Lifetime)
- Feature checklist
- Demo "Subscribe" mode (no real payments)

### Design
- "Indian festive meets minimal luxury" color palette
- Glassmorphism cards
- Framer Motion page transitions
- Mobile-first responsive design
- Bottom navigation on mobile

---

## Setup Instructions

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- A **Firebase project** (for full auth/storage functionality)

### Step-by-Step

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/greetings-app.git
   cd greetings-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** (see section below)

4. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase config values in `.env.local`.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

6. **Build for production** (optional)
   ```bash
   npm run build
   npm run preview
   ```

---

## Firebase Setup Guide

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Google**, **Email/Password**, and **Anonymous** providers
4. **Enable Cloud Firestore**:
   - Go to Firestore Database → Create database
   - Start in **test mode** for development
5. **Enable Storage**:
   - Go to Storage → Get started
   - Use default rules for development
6. **Get config values**:
   - Go to Project Settings → General → Your apps → Web app
   - Copy the `firebaseConfig` object values into your `.env.local`

---

## Folder Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx       # Login screen with 3 auth options
│   │   └── ProfileSetup.jsx    # Name & avatar setup form
│   ├── home/
│   │   ├── HomePage.jsx        # Main content area
│   │   ├── CategoryFilter.jsx  # Horizontal pill filter bar
│   │   ├── TemplateGrid.jsx    # Responsive card grid
│   │   └── TemplateCard.jsx    # Individual template card
│   ├── editor/
│   │   ├── CardEditor.jsx      # Editor controls panel
│   │   └── CanvasOverlay.jsx   # HTML5 Canvas rendering
│   ├── modals/
│   │   ├── PremiumModal.jsx    # Premium upsell popup
│   │   └── ShareModal.jsx      # Sharing options modal
│   ├── layout/
│   │   ├── Navbar.jsx          # Desktop top navigation
│   │   └── BottomNav.jsx       # Mobile bottom navigation
│   └── ui/
│       ├── Badge.jsx           # Free/Premium badge
│       ├── Button.jsx          # Reusable button component
│       └── Loader.jsx          # Full-screen loading spinner
├── store/
│   └── useStore.js             # Zustand global state
├── hooks/
│   ├── useAuth.js              # Firebase auth hook
│   └── useCanvas.js            # Canvas rendering hook
├── lib/
│   ├── firebase.js             # Firebase initialization
│   └── templates.js            # Mock template data (20 templates)
├── pages/
│   ├── Login.jsx               # Login page wrapper
│   ├── Home.jsx                # Home page wrapper
│   └── Editor.jsx              # Editor page wrapper
├── App.jsx                     # Root with routing
├── main.jsx                    # Entry point
└── index.css                   # Design system & global styles
```

---

## Screenshots

<img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/9803c8c9-dd48-45d3-ba0c-99b0bbdd6033" />


---

## Future Improvements

- **Firebase CDN** for template images instead of picsum.photos
- **AI-generated quotes** using GPT API for dynamic personalization
- **React Native port** for native iOS/Android apps
- **Server-side image rendering** with Sharp.js for better quality & performance
- **User-generated templates** — allow users to upload their own backgrounds
- **Analytics dashboard** to track template popularity and user engagement
- **Multi-language support** (Hindi, Arabic, etc.)
- **Template versioning** and A/B testing for premium conversion

---

## License

This project is built as an internship assessment submission. All rights reserved.
