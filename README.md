# We Debate Club app

Web app for **We Debate Club** (Djerba): club showcase, member hub, debate tools and motion library.

- **Public:** home, events, gallery, speech timer, motion generator, team draw, score sheet, motion library, format guides, practice drills.
- **Members:** apply to join, register for events, profile with points history, leaderboard, suggest motions, save score sheets.
- **Admins:** approve applications, create events, mark attendance (auto +5 points), award points, review motions, manage roles.

Stack: Vite + React + React Router, Firebase (Auth + Firestore), hosted on Vercel. Installable on phones (PWA).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Without Firebase keys the showcase and all debate tools work; member features show a "not set up yet" notice.

## 1. Set up Firebase (free plan)

1. Go to <https://console.firebase.google.com> → **Add project** (e.g. `we-debate-club`). Analytics is not needed.
2. **Build → Authentication → Get started.** Enable **Google** and **Email/Password**.
3. **Build → Firestore Database → Create database.** Choose production mode and a location close to Tunisia (e.g. `eur3` or `europe-west1`).
4. **Firestore → Rules:** paste the contents of [`firestore.rules`](firestore.rules) and click **Publish**.
5. **Project settings (gear) → Your apps → Web (`</>`)** → register an app → copy the config values.
6. Copy `.env.example` to `.env.local` and fill in the values.
7. **Authentication → Settings → Authorized domains:** add your custom domain and your `*.vercel.app` domain.

### Make yourself the first admin

1. Run the app and sign in once (this creates your user document).
2. In the Firebase console → **Firestore → users →** your document → change `role` from `guest` to `admin`.
3. Reload the app: an **Admin** link appears in the menu. From then on, promote others from **Admin → Members**.

## 2. Deploy to Vercel (keep the old domain)

1. Push this folder to a GitHub repository (it can be the old `we-debate` repo; this replaces the old Create React App site).
2. In Vercel, open the existing project → **Settings → Git**, connect the repo (or **Add New → Project** and import it). Framework preset: **Vite**.
3. **Settings → Environment Variables:** add all six `VITE_FIREBASE_*` values from `.env.local`.
4. Deploy. If you created a new Vercel project, move the custom domain to it under **Settings → Domains**.

`vercel.json` already routes all paths to the app so links like `/events/abc` work on refresh.

## How things fit together

| Collection | What | Who writes |
|---|---|---|
| `users/{uid}` | name, bio, photo, `role` (guest/member/admin), `points` | user (name/bio only), admins |
| `applications/{uid}` | join request + status | applicant creates, admins approve/reject |
| `events/{id}` | title, type, date, location, capacity, optional external form link | admins |
| `events/{id}/registrations/{uid}` | sign-up + `attended` | members register, admins mark attendance |
| `motions/{id}` | text, topic, difficulty, `approved` | members suggest, admins approve |
| `points/{id}` | ledger of awarded points | admins |
| `scoresheets/{id}` | saved judge sheets | members |

- Club text (benefits, achievements, activities, gallery) lives in `src/data/club.js`.
- Starter motions are in `src/data/motions.js`; import them into Firestore from **Admin → Motions**.
- Format guides and practice drills are in `src/data/formats.js`.
- Brand colors are CSS variables at the top of `src/index.css`.

## Testing the security rules (optional)

Requires Java and the Firebase CLI (`npm i -g firebase-tools`):

```bash
firebase emulators:start
# in another terminal, with VITE_USE_EMULATORS=true in .env.local
npm run dev
```

## Notes

- Node 18 works; Node 20+ is recommended. The `overrides` in `package.json` keep the PWA build working on Node 18.
- Photos: Firebase Storage needs a paid plan, so event images are URLs (put files in `public/assets/` or use any hosted image link).
