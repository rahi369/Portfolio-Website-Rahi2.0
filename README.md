# RAHI — Personal Portfolio & Design Gallery Platform

Production portfolio platform for **Md. Humaun Husen Rahi** (`RAHI`) — Freelancer | Web Developer | Entrepreneur, Founder of **SAMIA'S CLOSET**, Rajnagar, Moulvibazar, Bangladesh.

---

## 1. Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend / Database**: Firebase Authentication (Google Sign-In + Email/Password) & Cloud Firestore (`firestore.rules` hardened for single-admin writes)
- **Server / Media**: Express (`server.ts`) for local/Node authenticated file uploads (`POST /api/upload`), `/robots.txt`, `/sitemap.xml`, security headers, plus optional **Cloudinary** unsigned uploads for serverless deployments (Vercel)

---

## 2. Firestore Database Schema

All portfolio data is modeled in `firebase-blueprint.json` and enforced by `firestore.rules`:

| Collection | Access | Purpose |
| --- | --- | --- |
| `site_profile/main` | Public read, Admin write | Hero name, title, tagline, intro, bio summary, portrait URL |
| `site_about/main` | Public read, Admin write | 6 editable biography sections (`personalIntro`, `journey`, `webDevBackground`, `entrepreneurship`, `education`, `professionalGoals`) |
| `site_settings/main` | Public read, Admin write | Contact email, WhatsApp number, social links, SEO defaults, CV PDF URL & public toggle, Cloudinary settings, maintenance mode |
| `gallery/{id}` | Public read if `published == true`, Admin full CRUD | Design gallery items (`title`, `description`, `category`, `imageUrl`, `projectLink`, `createdDate`, `featured`, `published`) |
| `projects/{id}` | Public read if `published == true`, Admin full CRUD | Selected projects (`title`, `role`, `summary`, `techStack[]`, `liveUrl`, `repoUrl`, `imageUrl`, `status`, `featured`, `published`) |
| `skills/{id}` | Public read, Admin write | Technical & creative skills grouped across 6 categories |
| `experience/{id}` | Public read, Admin write | Timeline entries (`work`, `freelance`, `entrepreneurship`, `education`) |
| `achievements/{id}` | Public read if `published == true`, Admin full CRUD | Certificates & verified achievements |
| `services/{id}` | Public read if `published == true`, Admin full CRUD | Freelance services with optional price notes |
| `messages/{id}` | Public `create` (strict schema + `status: "unread"`), Admin read/update/delete | Private client inquiries submitted from `/contact` |
| `admins/{uid}` | Owner read | Optional UID-based admin allowlist in addition to verified `rahihumaun369@gmail.com` |

---

## 3. Local Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

---

## 4. Firebase Admin & Authentication Setup

1. Ensure your Firebase project (`portfolio-website-for-rahi` or your active project) has:
   - **Cloud Firestore** enabled
   - **Authentication → Sign-in method**:
     - Enable **Google**
     - Enable **Email/Password** (if you want password login in `/admin/login` alongside Google Sign-In)
2. Deploy `firestore.rules` to your Firebase project:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. Sign in at `/admin/login` using **`rahihumaun369@gmail.com`** (verified email required by `firestore.rules`).
4. In `/admin/dashboard`, click **"Initialize Firestore Content"** once to persist the default profile, about sections, projects, skills, experience, services, and settings to Firestore.

---

## 5. Image & CV Upload Configuration

- **When running with Node (`server.ts`)**: Admin uploads go to `POST /api/upload` (protected by Firebase ID token verification against `rahihumaun369@gmail.com`) and save under `public/uploads/`.
- **When deployed statically on Vercel (`npm run build`)**: Configure **Cloudinary** (free tier):
  1. Create an **Unsigned Upload Preset** in your Cloudinary Dashboard.
  2. Either set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env` / Vercel Environment Variables, **or** paste them in `/admin/settings` → Site Settings.

---

## 6. Deploying to GitHub & Vercel (`rahi-portfolio`)

1. Push this repository to GitHub (excluding `.env` and `node_modules`).
2. Import the repository into Vercel as project **`rahi-portfolio`** (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
3. Add the following Environment Variables in Vercel using your Firebase project **`portfolio-website-for-rahi`** web app config:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID=portfolio-website-for-rahi`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_FIRESTORE_DATABASE_ID` (leave blank or `(default)` if using the default Firestore database)
   - `VITE_CLOUDINARY_CLOUD_NAME` (optional, recommended for gallery & CV uploads on Vercel)
   - `VITE_CLOUDINARY_UPLOAD_PRESET` (optional, recommended for gallery & CV uploads on Vercel)
4. Add your Vercel domain (e.g., `rahi-portfolio.vercel.app`) to **Firebase Console → Authentication → Settings → Authorized domains** so Google Sign-In works on production.
5. `vercel.json` is included so all client routes (`/gallery`, `/projects`, `/admin/login`, etc.) resolve cleanly on page reload.
