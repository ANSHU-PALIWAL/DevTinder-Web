# 🏘️ ConnectNeighbour — Frontend

<div align="center">

![ConnectNeighbour Banner](https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80&h=300)

**Hyper-local, privacy-first social networking for your street.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux&logoColor=white&style=for-the-badge)](https://redux-toolkit.js.org/)

</div>

---

## 📌 About the Project

ConnectNeighbour is a **hyper-local social network** that allows you to discover, match, and connect with verified neighbors within a 100km radius — all without ever sharing your phone number. This repo is the **React + Vite frontend** of the application.

Think of it as Tinder, but for building real local communities.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | Email/password + Google OAuth (via `@react-oauth/google`) |
| 🃏 **Swipe Feed** | Neighbor discovery with Framer Motion swipe animations |
| 🗺️ **Discovery Map Radar** | Live interactive map (MapLibre GL) showing neighbors in 100km radius |
| 👤 **Rich Profiles** | 6-image HD gallery, bio, skill tags, custom privacy settings |
| 🤝 **Mutual Match System** | Chat only unlocks after both parties connect |
| 📡 **PWA Ready** | Installable as a native app via `vite-plugin-pwa` |
| 🌐 **Public Marketing Pages** | Home, About, Blog (archive + detail), Contact |
| 📬 **Contact Form** | Submissions saved to MongoDB, auto-reply email via AWS SES |

---

## 🗂️ Project Structure

```
devTinder-Web/
├── public/
│   ├── favicon.png
│   ├── manifest.webmanifest   # PWA manifest
│   ├── sitemap.xml            # SEO sitemap (all public routes)
│   └── robots.txt             # Search engine crawler directives
├── src/
│   ├── components/
│   │   ├── Body.jsx           # Root layout — auth gating, location update, install PWA prompt
│   │   ├── NavBar.jsx         # Authenticated user navigation
│   │   ├── PublicNavBar.jsx   # Unauthenticated navigation (Home, About, Blog, Contact)
│   │   ├── Footer.jsx         # App footer (shown only when logged in)
│   │   ├── Feed.jsx           # Swipe card feed (protected)
│   │   ├── Login.jsx          # Login + Signup + Google OAuth
│   │   ├── HomePage.jsx       # Public landing page (/home)
│   │   ├── AboutUs.jsx        # About page (/about)
│   │   ├── BlogsPage.jsx      # Blog archive (/blogs)
│   │   ├── BlogDetail.jsx     # Single article (/blogs/:slug)
│   │   ├── ContactPage.jsx    # Contact form (/contact)
│   │   ├── RadarView.jsx      # Discovery Map Radar (protected)
│   │   ├── Connections.jsx    # Mutual connections list (protected)
│   │   ├── Requests.jsx       # Pending connection requests (protected)
│   │   ├── ProfileView.jsx    # View own profile (protected)
│   │   ├── EditProfile.jsx    # Edit profile (protected)
│   │   ├── PublicProfile.jsx  # Matched user's public profile view (protected)
│   │   ├── Settings.jsx       # Privacy & account settings (protected)
│   │   └── NotFound.jsx       # 404 page
│   ├── utils/
│   │   ├── appStore.js        # Redux store configuration
│   │   ├── userSlice.js       # Redux slice for authenticated user state
│   │   ├── feedSlice.js       # Redux slice for feed card data
│   │   ├── connectionSlice.js # Redux slice for connections
│   │   ├── requestSlice.js    # Redux slice for pending requests
│   │   ├── constants.js       # API_BASE_URL and other shared constants
│   │   └── blogData.js        # Static data for 6 blog posts
│   ├── App.jsx                # Root component — BrowserRouter + all route definitions
│   ├── main.jsx               # React DOM entry point
│   └── index.css              # Global styles (Tailwind base)
├── index.html                 # Entry HTML — full SEO meta, JSON-LD structured data
├── vite.config.js             # Vite config — React plugin + PWA plugin
├── eslint.config.js
├── package.json
└── .env                       # Environment variables (see below — never commit)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v22+
- **npm** v10+

### 1. Clone & install
```bash
git clone https://github.com/ANSHU-PALIWAL/connectneighbour-web.git
cd devTinder-Web
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. Run development server
```bash
npm run dev
# → http://localhost:5173
```

### 4. Build for production
```bash
npm run build
# Output in /dist
```

---

## 🌍 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL (e.g. `https://api.connectneighbour.in`) |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Google OAuth 2.0 Client ID from Google Cloud Console |
| `VITE_MAPBOX_TOKEN` | ✅ | Mapbox GL public access token for the Radar map |

---

## 🧭 Routes

### Public (no auth required)
| Route | Component | Description |
|---|---|---|
| `/home` | `HomePage` | Main marketing landing page |
| `/about` | `AboutUs` | About ConnectNeighbour |
| `/blogs` | `BlogsPage` | Blog post archive grid |
| `/blogs/:slug` | `BlogDetail` | Individual blog article |
| `/contact` | `ContactPage` | Contact form |
| `/login` | `Login` | Email/password + Google login |

### Protected (requires authentication)
| Route | Component | Description |
|---|---|---|
| `/` | `Feed` | Swipe card discovery feed |
| `/radar` | `RadarView` | Interactive discovery map |
| `/connections` | `Connections` | Mutual connections list |
| `/requests` | `Requests` | Pending connection requests |
| `/profile` | `ProfileView` | View own full profile |
| `/profile/edit` | `Profile` | Edit profile + gallery |
| `/match/profile` | `PublicProfile` | View a matched neighbor's profile |
| `/settings` | `Settings` | Account & privacy settings |

---

## 🏗️ Architecture Notes

### State Management (Redux Toolkit)
- `userSlice` — logged-in user profile data
- `feedSlice` — the array of neighbor cards shown in the feed
- `connectionSlice` — mutual connections
- `requestSlice` — incoming/outgoing requests

### Authentication Flow
1. On app load, `Body.jsx` calls `GET /profile/view` to check session
2. If 401 and on a **protected route** → redirects to `/login`
3. Public routes (`/home`, `/about`, `/blogs`, `/blogs/*`, `/contact`) are **exempt** from the redirect
4. Unauthenticated users hitting `/` are redirected to `/home`
5. Authenticated users hitting `/login` are redirected to `/`

### SEO Strategy
- `index.html` — global OG/Twitter/JSON-LD tags, preconnect hints
- Per-page: `<Helmet>` from `react-helmet-async` sets unique `<title>` + `<meta description>` + `<canonical>` per route
- Blog articles inject `BlogPosting` JSON-LD structured data
- `public/sitemap.xml` covers all 12 indexable public URLs
- `public/robots.txt` explicitly disallows authenticated routes

---

## 📦 Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool + HMR |
| TailwindCSS | v4 | Utility-first CSS |
| Framer Motion | 12 | Animations |
| Redux Toolkit | 2 | State management |
| React Router DOM | 7 | Client routing |
| Axios | 1 | HTTP client |
| Lucide React | 0.57 | Icons |
| MapLibre GL | 5 | Map rendering (Radar) |
| react-helmet-async | latest | Per-page SEO meta tags |
| @react-oauth/google | 0.13 | Google OAuth |
| vite-plugin-pwa | 1 | PWA manifest + service worker |

---

## 📄 License

ISC © [Priyanshu Paliwal](https://www.linkedin.com/in/priyanshu-paliwal-017a6a262/)
