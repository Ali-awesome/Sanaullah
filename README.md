# Mohammad Sanaullah — Portfolio

A MERN rebuild of the "Tokyo" portfolio template, filled with Mohammad Sanaullah's
real resume data (`Associate_Project_Manager_tex.pdf`) and the template's own stock
photos/CSS. Backend follows Clean Architecture / DDD-lite; frontend is a lean React
app that reuses the original theme's CSS untouched.

## Contents

- [Structure & architecture](#structure--architecture)
- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
- [Database setup](#database-setup)
- [Environment variables reference](#environment-variables-reference)
- [Adding blog posts & reading contact messages](#adding-blog-posts--reading-contact-messages)
- [Changing images](#changing-images)
- [Responsive design](#responsive-design)
- [Animation & interaction fidelity](#animation--interaction-fidelity)
- [SEO](#seo)
- [Tests](#tests)
- [Content decisions](#content-decisions)
- [Git & GitHub setup](#git--github-setup)
- [Deployment](#deployment)
  - [Option A — Vercel (frontend + backend, recommended)](#option-a--vercel-frontend--backend-recommended)
  - [Option B — Netlify (frontend) + Vercel Functions (backend)](#option-b--netlify-frontend--vercel-functions-backend)
  - [Option C — GitHub Pages (frontend only)](#option-c--github-pages-frontend-only)
  - [Post-deployment checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)

## Structure & architecture

```
backend/    Node.js + Express API (domain -> application -> infrastructure -> interfaces)
frontend/   React (Vite) SPA, using the original Tokyo theme CSS/images as-is
```

### Backend layers (`backend/src`)

- `domain/` — `ContactMessage` and `BlogPost` entities (self-validating) and
  repository interfaces (`IProfileRepository`, `IContactRepository`, `IBlogPostRepository`)
  — the ports the rest of the app depends on.
- `application/` — use cases (`GetProfile`, `SubmitContactMessage`, `ListContactMessages`,
  `ListBlogPosts`, `CreateBlogPost`, `DeleteBlogPost`) that orchestrate the domain
  through those ports only, with no framework or storage details.
- `infrastructure/` — adapters that fulfill the ports: a static JSON-seeded
  `StaticProfileRepository`, and Mongo / in-memory pairs for contact messages and
  blog posts (Mongo if `MONGODB_URI` is reachable, otherwise an automatic
  in-memory fallback — no DB setup required to run locally; the blog store seeds
  itself with the résumé's real publications the first time it's empty).
- `interfaces/http/` — Express controllers, routes, and the `requireAdmin` middleware
  (the only layer that knows about HTTP).
- `api/index.js` — a Vercel serverless entrypoint that wraps the same Express
  app (see [Deployment](#deployment)); `server.js` is the plain long-running
  version used locally and by any traditional Node host.

This means the profile data source or either store can be swapped (e.g. a real
MongoDB collection for profile content) without touching use cases, controllers,
or the frontend — and it's what lets the test suite run entirely against fast
in-memory repositories instead of a real database.

## Prerequisites

- **Node.js 20+** and npm (Node 18 works too; the backend uses `node --watch`,
  available since Node 18.11). Check with `node -v`.
- **Git**, and a **GitHub account** if you want to push this and deploy from it.
- A **MongoDB connection string** if you want data to persist — optional for
  local dev (see [Database setup](#database-setup)), but effectively required
  for any real deployment (see the serverless caveat there).
- Accounts for whichever host(s) you deploy to: **Vercel** and/or **Netlify**
  are free to sign up for (GitHub login works for both) and don't require a
  credit card for the tiers used here.

## Local setup

```bash
git clone <your-repo-url>
cd Portfolio

# Backend
cd backend
cp .env.example .env      # edit: set ADMIN_TOKEN; optionally MONGODB_URI (see below)
npm install
npm run dev                # http://localhost:5000

# Frontend — in a second terminal
cd frontend
npm install
npm run dev                 # http://localhost:5173, proxies /api to :5000
```

Open `http://localhost:5173`. `npm run dev` on the backend uses `node --watch`,
so editing any backend file restarts the server automatically; Vite does the
same for the frontend with instant HMR.

Verify the backend independently at any time with:

```bash
curl http://localhost:5000/health          # {"status":"ok"}
curl http://localhost:5000/api/profile     # full profile JSON
```

## Database setup

The backend works with **zero database setup** out of the box: if `MONGODB_URI`
is unset or unreachable, `server.js` automatically falls back to in-memory
storage for contact messages and blog posts (`tryConnectMongo` in
`backend/src/infrastructure/db/connect.js` — it tries for 3 seconds, then logs
a warning and falls back). That's fine for trying the project out or for CI,
but **data is lost every time the server restarts**. Pick one of the two real
options below for anything you want to keep.

### Option 1 — Local MongoDB

1. Install MongoDB Community Server for your OS: https://www.mongodb.com/try/download/community
   (or run it in Docker: `docker run -d -p 27017:27017 --name mongo mongo`).
2. Make sure it's running (`mongod` as a service, or the Docker container started).
3. In `backend/.env`, set:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/sanaullah_portfolio
   ```
   (this is already the default in `.env.example` — the database itself doesn't
   need to be created ahead of time; MongoDB creates it on first write).
4. Restart `npm run dev` in `backend/`. You should see `[db] Connected to MongoDB`
   in the terminal instead of the in-memory fallback warning.

### Option 2 — MongoDB Atlas (free, works from anywhere — needed for deployment)

A local database isn't reachable from a deployed backend, so for
[Deployment](#deployment) you need a real, internet-reachable database. Atlas's
free tier (M0) is enough for this project:

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account
   (or sign in with Google/GitHub).
2. Create a new **Project** (any name), then **Build a Database** → choose the
   **M0 Free** tier → pick any cloud provider/region close to you → **Create**.
3. **Database Access** (left sidebar) → **Add New Database User**: choose
   *Password* authentication, set a username and a generated/strong password
   (save it somewhere — you'll need it in the connection string), and give it
   *Read and write to any database*.
4. **Network Access** (left sidebar) → **Add IP Address**:
   - For local dev, *Add Current IP Address* is enough.
   - For a serverless backend (Vercel/Netlify Functions), IPs aren't fixed —
     click **Allow Access from Anywhere** (`0.0.0.0/0`). This is the normal,
     expected setup for serverless; Atlas still requires the username/password
     from step 3 to actually authenticate, so this alone doesn't expose your data.
5. **Database** (left sidebar) → **Connect** on your cluster → **Drivers** →
   copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>`/`<password>` with the values from step 3 (URL-encode
   any special characters in the password — e.g. `@` → `%40`), and add a
   database name before the `?`:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/sanaullah_portfolio?retryWrites=true&w=majority
   ```
7. Put that in `backend/.env` for local use, and in the **backend host's**
   environment variables for deployment (see [Deployment](#deployment)) —
   never commit the real value to Git (`.env` is already git-ignored).

Whichever option you use, the very first time the backend connects with an
empty database it auto-seeds the "Publications & Learning" collection with the
three real entries from `backend/src/infrastructure/data/blogSeed.js`; after
that, it's managed entirely through the admin panel.

## Environment variables reference

**`backend/.env`** (copy from `backend/.env.example`):

| Variable        | Required | Default (if unset)                     | Purpose                                                        |
|------------------|:--------:|-----------------------------------------|------------------------------------------------------------------|
| `PORT`           | no       | `5000`                                  | Port the plain Node server listens on (irrelevant on Vercel).   |
| `MONGODB_URI`    | no*      | *(none — falls back to in-memory)*      | MongoDB connection string. *Effectively required for any deployment (see [Database setup](#database-setup)). |
| `CLIENT_ORIGIN`  | no       | `*` (any origin)                        | Allowed CORS origin(s) for the frontend. Comma-separate multiple, e.g. `https://your-site.vercel.app,https://your-site.netlify.app`. Tighten this for production. |
| `ADMIN_TOKEN`    | yes**    | *(none — admin routes return `503`)*    | Shared secret for the admin panel (`POST/DELETE /api/posts`, `GET /api/contact`). Use a long random string (e.g. `openssl rand -hex 32`). |

**`frontend/.env`** (copy from `frontend/.env.example`; optional for local dev):

| Variable            | Required | Default (if unset) | Purpose                                                                 |
|----------------------|:--------:|---------------------|---------------------------------------------------------------------------|
| `VITE_API_BASE_URL`  | no       | `/api`              | Where the frontend sends API requests. Leave unset locally (Vite proxies `/api` to the backend) and when frontend+backend share a domain. Set to your deployed backend's URL (e.g. `https://your-backend.vercel.app/api`) when they're on different hosts. |
| `VITE_BASE_PATH`     | no       | `/`                 | Only needed for a GitHub Pages *project* site — see [Option C](#option-c--github-pages-frontend-only). |

## Adding blog posts & reading contact messages

Both are managed from a small admin screen at **`/?admin=1`** on wherever the
frontend is running (a query param, not a route, so no server rewrite rules
are needed — works identically in dev and in every deployment option below).
It asks for the `ADMIN_TOKEN` set in the backend's environment, then lets you:

- add a new "Publications & Learning" post (title, source, date, summary, optional
  image/link) — it appears on the public site immediately;
- delete a post;
- add a new gallery photo (name + an image path/URL) — it appears in the
  Portfolio section's **"All"** tab immediately (that tab is a dedicated photo
  gallery, separate from the category-filtered project cards under the other
  tabs — see [Changing images](#changing-images) for how to get a new photo
  file onto the site first if you're not just linking an external URL);
- delete a gallery photo;
- read every message submitted through the public contact form, newest first.

This is backed by real API endpoints, protected by the `x-admin-token` header
(`backend/src/interfaces/http/middleware/requireAdmin.js`):

| Method | Path              | Auth  | Purpose                        |
|--------|-------------------|-------|---------------------------------|
| GET    | `/api/posts`      | none  | list posts (used by the public site) |
| POST   | `/api/posts`      | admin | create a post                   |
| DELETE | `/api/posts/:id`  | admin | delete a post                   |
| GET    | `/api/gallery`      | none  | list gallery photos (used by the "All" tab) |
| POST   | `/api/gallery`      | admin | add a gallery photo             |
| DELETE | `/api/gallery/:id`  | admin | delete a gallery photo          |
| GET    | `/api/contact`    | admin | read the contact inbox          |
| POST   | `/api/contact`    | none  | submit the public contact form  |

If `ADMIN_TOKEN` isn't set, the admin routes respond `503` rather than being
silently open. Messages persist in MongoDB when configured; with the in-memory
fallback they're lost on server restart (fine for local dev, not for production —
set `MONGODB_URI` for anything real, and doubly so for a serverless deployment,
where "restart" effectively happens on every cold start). Email notifications
on new messages weren't built in, since that needs your own SMTP/provider
credentials — wiring [nodemailer](https://nodemailer.com/) into
`SubmitContactMessage`'s use case is the natural next step if you want that.

## Changing images

Images live under `frontend/public/img/`, split by section:

| What | File(s) | Used for |
|---|---|---|
| Your photo | `img/slider/1.jpg` | Home avatar + About page photo |
| Portfolio project images | `img/portfolio/3.jpg`, `4.jpg`, `5.jpg`, `6.jpg` | The 4 category-filtered project cards |
| Publication/news images | `img/news/1.jpg`, `2.jpg`, `3.jpg` | The "Publications & Learning" cards |
| CV | `cv/Mohammad_Sanaullah_CV.pdf` | "Download CV" button — keep this exact filename |

Two ways to change them:

1. **Keep the same filenames** — just overwrite the file in place. No code
   changes needed; Vite serves static files directly, so a refresh is enough.
2. **Use a different filename/path** — drop the new file anywhere under
   `frontend/public/img/`, then update the matching path in
   `backend/src/infrastructure/data/profileData.js` (`avatarImage`, or a
   portfolio item's `image`) or `backend/src/infrastructure/data/blogSeed.js`
   (a post's `image` — note this file only seeds the database once, on first
   empty-collection connect; editing it after the DB is already seeded won't
   retroactively change existing posts, only new ones created from a fresh,
   empty store).

Gallery photos (the Portfolio section's "All" tab) and new blog posts don't
need a code change at all — their `image` field is just typed into the admin
panel (`/?admin=1`) as a path already under `public/img/` or any external URL,
same as option 2 above but at runtime instead of in source.

Aspect ratio matters more than exact pixel size: portfolio/gallery images
render as squares and the avatar as a large circle-ish blob, both cropped via
`background-size: cover`, so a mismatched ratio gets cropped, not distorted.

## Responsive design

The original Tokyo theme's CSS already ships a fairly complete set of breakpoints
(1600 / 1200 / 1040 / 768px) that this rebuild reuses untouched, so most of the
responsiveness came for free. What was added/verified on top:

- Fixed two theme rendering patterns the React rewrite initially missed (an
  invisible sizing `<img>` behind the portfolio/publication background images,
  and a white-on-white modal close button) that only showed up once real layout
  was exercised.
- Verified at 375px (mobile), ~820px (tablet), and desktop widths: navigation
  (hamburger + slide-in menu), the About page's two-column-to-stacked info/skills/
  education layout, the portfolio grid (3 columns → 1 column), the detail/service
  modals, and the contact map/form all reflow correctly with no horizontal overflow.
- The new admin panel (plain inline styles, not theme CSS) was adjusted so its
  login/post form stacks full-width on narrow screens instead of squeezing
  input+button onto one line.

## Animation & interaction fidelity

The original theme's JS (`init.js`) drives several effects that only exist as
unused CSS in a copy-the-stylesheet rebuild. These are now reimplemented in
React, matching the source's exact timing/logic rather than an approximation:

- **Preloader** (`components/Preloader.jsx`) — the intro curtain: closes at
  1300ms, fully removed at 2500ms, skipped on mobile user agents — same
  timing as the theme's own `tokyo_tm_preloader()`.
- **Custom cursor** (`components/Cursor.jsx`) — the outer ring + inner dot
  that track the mouse 1:1 and grow/fade over any `<a>` (`.cursor-hover`),
  reimplementing `tokyo_tm_cursor()`.
- **Section transitions** — clicking a nav item now reproduces the theme's
  `.hidden` / `.active.animated` / `.fadeInLeft` class scheme from
  `tokyo_tm_page_transition()`: the incoming section slides/fades in via
  animate.css's `fadeInLeft` (already bundled in `plugins.css`, just unused
  before), and — matching the original — that entrance animation does *not*
  play on the very first paint, only on navigations after that.
- **Portfolio hover tooltip** — hovering a project now shows its title/category
  in a small label that follows the cursor (`tokyo_tm_portfolio_titles`),
  reimplementing `tokyo_tm_projects()`. An earlier version of this label
  tracked far from the cursor: the Portfolio section's entrance animation
  (`fadeInLeft`) was never removed after it finished playing, and its final
  keyframe — `transform: translateX(0)`, a visual no-op but *not* the value
  `none` — silently made that section the tooltip's fixed-position
  containing block instead of the viewport. Fixed by clearing the animation
  class once it finishes (`App.jsx`), matching the theme's own behavior.
- **Portfolio detail popup** — clicking a project reproduces the theme's
  "Detail" popup style byte-for-byte against the live template: a full-width
  hero image (`.top_image`), title + category, a two-column body
  (`.textbox` description / `.detailbox` list of Client, Category, Date, and
  real Facebook/X/LinkedIn share links — the original's own share icons are
  inert `href="#"` placeholders, since a static demo has no real URL to
  share), and an `.additional_images` strip that renders only when a project
  actually supplies extra photos (none currently do, so it stays absent
  rather than filling the space with unrelated stock images). Reusing the
  theme's own `.description_wrap` wrapper (rather than ad hoc padding) also
  restores its scroll region and top/bottom fade edges, and its `.close`
  button's *intended* fixed-outside-the-box placement — which an earlier,
  narrower fix had overridden after mistaking a missing-wrapper symptom for
  a genuinely broken button. The same `.description_wrap` fix applies to the
  Service and Publications popups for consistency.
- **Modal open/close fade** — Service, Portfolio (project + gallery photo),
  and Publications popups all mounted only while something was selected,
  which skipped the theme's `.tokyo_tm_modalbox` opacity/visibility
  transition entirely (an element can't fade from a state it was never
  rendered in). A first fix tried delaying the `opened` class by one
  `requestAnimationFrame` so there'd be a "before" state to animate from —
  but rAF callbacks are throttled or dropped entirely for backgrounded/
  hidden tabs, which left the popup mounted yet permanently stuck at
  `opacity: 0` in some conditions (reported as "the photo pop-up not
  displaying correctly"). Fixed properly by matching the original's own
  architecture instead: the modal *shell* (`hooks/useModalTransition.js` +
  each section) now renders unconditionally from first mount, exactly like
  the theme's own `tokyo_tm_modalbox()`, which `prepend()`s the popup div to
  the page once on load and only ever toggles the `opened` class afterward.
  `opened` is now derived directly (`value != null`), so it changes
  synchronously with no async gap for a dropped frame to break — only the
  *content* (which needs one-render-late state to survive the close fade)
  still goes through the hook.
- **Modals rendering partly behind the sidebar** — every popup (both
  Portfolio modals, Service, Publications) was nested inside its section's
  `<div id="...">`, and `.tokyo_tm_section` is `position: absolute` with its
  own explicit `z-index` (see style.css) — which makes it a CSS stacking
  context. A stacking context traps its descendants' `z-index` values so
  they only ever rank *within* it; since the section's own z-index (8–10)
  is lower than the sidebar's (`.leftpart`, 12), the whole section — modal
  included, regardless of the modal's own `z-index: 15` — rendered behind
  the sidebar as a unit. Invisible on Service/Publications (white popup
  content over the sidebar's white background), obvious on Portfolio's
  photo-filled popups. The original theme sidesteps this by never nesting
  its modal markup inside a section to begin with — `tokyo_tm_modalbox()` in
  init.js prepends the popup div straight onto `.tokyo_tm_all_wrap`, a
  sibling of the sidebar. Reproduced with `ReactDOM.createPortal` in each
  section, rather than lifting modal state up to `App.jsx` — cheaper, and
  every existing test kept working unmodified since React Testing Library
  queries the whole document, portals included. The portal target
  (`hooks/usePortalTarget.js`) matters: an initial version targeted
  `document.body`, which fixes the stacking bug but also escapes the
  theme's `.tokyo_tm_all_wrap *{ box-sizing: border-box }` reset — every
  padding/width calculation in the modal markup assumes that, so without it
  `.description_wrap`'s `padding: 50px` *added* to its `width: 100%` instead
  of being included in it, overflowing `.box_inner`'s right edge (reported
  as "right side of the image is outside popup boundary", plus an unwanted
  scrollbar and content pushed down). Targeting `.tokyo_tm_all_wrap` itself
  fixes both at once: still a sibling of the sidebar (outside any section's
  stacking context), but still a real descendant of the reset.
- **Portfolio filter-tab transition** — clicking a category tab swapped the
  grid's contents instantly; the original uses Isotope (`tokyo_tm_portfolio()`
  in init.js) to animate the filter over 750ms instead. Rather than pull in
  Isotope (a masonry layout engine) for what's a plain CSS grid here,
  `Portfolio.jsx` times a plain opacity cross-fade to the same 750ms total
  (375ms out, swap, 375ms in) — the active-tab highlight still updates
  instantly on click, matching the original's separate, un-animated
  "current"-class handler.
- **Equal-size cards** — the theme itself never forces uniform card height; the
  original demo just looked uniform because every service/news card reused
  the *same* placeholder sentence. With real content of varying length, an
  explicit `min-height`/`height` + line-clamp was added in `custom.css` (Service
  and Publications cards) so every card is the same size regardless of content
  length or which grid row it falls in — verified with real DOM measurements,
  not just visually (all 6 service cards: 386px; all 3 publication cards: 540px).

Time-based behavior (the preloader especially) is covered by unit tests using
fake timers rather than live browser screenshots — a 2.5s animation is easy to
miss or mistime when racing real network round-trips, so `Preloader.test.jsx`
asserts on its exact class transitions at simulated timestamps instead.

## SEO

- Proper `<title>`/meta description, Open Graph and Twitter Card tags, a canonical
  link, and a JSON-LD `Person` structured-data block in `frontend/index.html`.
- `robots.txt` and `sitemap.xml` in `frontend/public/`.
- Exactly one `<h1>` on the page (the name, in the Home section); every section
  title is now an `<h2>` (was `<h3>` in the original template — a `custom.css`
  rule keeps its original visual size while fixing the heading hierarchy).
- Descriptive `aria-label`s on the avatar and social icons for assistive tech.
- **Caveat:** `sanaullah.dev` in `index.html`, `robots.txt`, and `sitemap.xml` is
  a placeholder — once you have a real deployed domain, replace every
  occurrence with it (`grep -rn sanaullah.dev frontend/` finds them all). And
  because this is a client-rendered SPA (content is fetched from the API after
  load, not present in the initial HTML), search engines that don't execute
  JavaScript will index very little. Google generally does render JS, but for
  stronger, more reliable SEO the real next step is server-side rendering or
  static pre-rendering (e.g. moving the frontend to Next.js, or pre-rendering
  `index.html` at build time) — out of scope here to keep this rebuild lean,
  but worth knowing about if ranking matters a lot.

## Tests

```
cd backend  && npm test   # 30 tests: domain entities, use cases, HTTP routes (supertest), CORS config
cd frontend && npm test   # 17 tests: Contact form, Portfolio filter/modal/tooltip, Publications,
                          #           Sidebar nav, Preloader timing, Cursor tracking/hover,
                          #           App section-transition classes
```

Backend tests run against the in-memory repositories (no real MongoDB needed).
Frontend tests use Vitest + Testing Library with the API module mocked — no
network calls, no running dev server required. The Vercel serverless
entrypoint (`backend/api/index.js`) was smoke-tested manually (wrapped in a
plain Node `http.createServer` and hit with real requests) rather than added
to the automated suite, since it's a thin adapter over the already-tested
`createApp`.

## Content decisions

Everything on the page is sourced from the resume — nothing about Mohammad
Sanaullah is invented. A few sections of the original template didn't have a
truthful equivalent, so they were adapted rather than filled with placeholder text:

- **Testimonials** (fake client quotes) → dropped.
- **Pricing packages** ($0/$30/$70 tiers) → dropped; doesn't apply to a personal résumé site.
- **Fun Facts** → replaced with real impact metrics from the résumé (records processed, adoption lift).
- **Partners logos** → replaced with a plain "Tools & Platforms" list (the original logos were generic agency placeholders, not real tool brands).
- **News/blog posts** (stock articles about photography) → replaced with "Publications & Learning": the real IEEE paper and completed courses.
- **Portfolio** → the résumé's actual projects (Job Market Intelligence, Best CV, the IEEE CAPTCHA paper, the RSA study), still using the template's stock photography as visuals.

The template's interactive plugins (isotope masonry, owl-carousel, magnific-popup)
were reimplemented as small, native React state — filtering, a lightweight modal,
a slide-in mobile menu — instead of pulling in the original jQuery plugin bundle,
since the visual design comes entirely from the reused CSS. The preloader intro,
custom cursor, and portfolio hover tooltip *are* faithfully reimplemented — see
[Animation & interaction fidelity](#animation--interaction-fidelity). The one icon
asset that 404'd on the source site (the `fontello` webfont) was replaced with
`react-icons` for the social links. Testimonials (fabricated client quotes) remain
intentionally dropped, per the content-honesty decision above — that one wasn't
reversed by the animation-fidelity pass.

## Git & GitHub setup

If this isn't a Git repo yet:

```bash
cd Portfolio
git init
git add .
git commit -m "Initial commit"
```

Create an empty repository on GitHub (github.com → **+** → **New repository** —
don't initialize it with a README/`.gitignore`, since this project already has
them), then point your local repo at it and push:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

Or, with the GitHub CLI installed (`gh auth login` once first):

```bash
gh repo create <your-repo> --public --source=. --remote=origin --push
```

Both `frontend/.env` and `backend/.env` are already covered by the root
`.gitignore` — double-check `git status` never lists them before pushing, so
your `ADMIN_TOKEN` and `MONGODB_URI` never end up in the repo. Deployment
platforms read secrets from *their own* environment-variable settings (see
below), not from a committed `.env` file.

## Deployment

This is a two-part app (a Node/Express API + a static React frontend), so
"deploy" means deploying both, and pointing the frontend at the backend's URL.
Three ready-to-use paths are included; pick based on what you want:

| | Frontend | Backend | Notes |
|---|---|---|---|
| **A. Vercel (recommended)** | Vercel | Vercel Functions | Everything in one dashboard/account. |
| **B. Netlify + Vercel** | Netlify | Vercel Functions | If you specifically want the frontend on Netlify. |
| **C. GitHub Pages** | GitHub Pages | *(needs A or B's backend, or none)* | Frontend-only host — no server to run the API on. |

All three need a database reachable from the internet — see
[MongoDB Atlas](#option-2--mongodb-atlas-free-works-from-anywhere--needed-for-deployment)
above. **A serverless function's memory does not persist between requests**,
so without `MONGODB_URI` set, the deployed backend will still boot and serve
the static profile fine, but every contact message / added post can vanish
the moment the function goes cold — set it before relying on either feature.

### Option A — Vercel (frontend + backend, recommended)

Deploy the backend and frontend as **two separate Vercel projects** from the
same GitHub repo (Vercel lets you point multiple projects at one repo with
different root directories).

**1. Push the repo to GitHub** (see [Git & GitHub setup](#git--github-setup)) if you haven't.

**2. Backend project:**
1. https://vercel.com → **Add New** → **Project** → import your GitHub repo.
2. **Root Directory**: click Edit, select `backend`.
3. Framework Preset: Vercel should detect *Other* — that's fine, `backend/vercel.json`
   (already in this repo) tells it to run `api/index.js` as a serverless function
   for every route.
4. **Environment Variables**: add `MONGODB_URI`, `ADMIN_TOKEN`, and (after step 3
   below) `CLIENT_ORIGIN` set to your frontend's URL.
5. **Deploy**. Note the resulting URL, e.g. `https://your-backend.vercel.app`.
6. Confirm it works: `curl https://your-backend.vercel.app/health` → `{"status":"ok"}`.

**3. Frontend project:**
1. **Add New** → **Project** → import the *same* repo again as a second project.
2. **Root Directory**: `frontend`. Framework Preset: *Vite* (auto-detected).
3. **Environment Variables**: add `VITE_API_BASE_URL` =
   `https://your-backend.vercel.app/api` (the URL from step 2.5, with `/api` on the end).
4. **Deploy**. Note this URL too, e.g. `https://your-site.vercel.app`.

**4. Close the loop:** go back to the **backend** project's environment
variables and set `CLIENT_ORIGIN` to the frontend URL from step 3.4 (comma-separate
if you also keep a preview URL or custom domain — see the CORS note in
[Environment variables reference](#environment-variables-reference)), then
redeploy the backend project (Vercel → Deployments → ⋯ → Redeploy) for the
change to take effect.

Every subsequent `git push` to `main` auto-redeploys both projects; pushes to
other branches get their own preview URLs.

### Option B — Netlify (frontend) + Vercel Functions (backend)

Deploy the backend exactly as in **Option A, step 2** (Vercel Functions — Netlify
doesn't run this Express app without extra adaptation, so pairing Netlify's
frontend hosting with Vercel's backend hosting is the simplest reliable combo).
Then, for the frontend:

1. https://app.netlify.com → **Add new site** → **Import an existing project** →
   choose your GitHub repo.
2. Netlify should read `netlify.toml` (already in this repo) automatically:
   base directory `frontend`, build command `npm run build`, publish directory `dist`.
   If it doesn't autodetect, set those three fields manually in the UI.
3. **Site configuration → Environment variables**: add `VITE_API_BASE_URL` =
   `https://your-backend.vercel.app/api`.
4. **Deploy site**. Note the resulting URL (e.g. `https://your-site.netlify.app`),
   then add it to the backend's `CLIENT_ORIGIN` on Vercel and redeploy the backend,
   same as Option A step 4.

**Alternative to `VITE_API_BASE_URL`:** `netlify.toml` includes a commented-out
`[[redirects]]` block that proxies `/api/*` on your Netlify domain straight to
the backend. Uncomment it and fill in your backend URL instead of setting
`VITE_API_BASE_URL`, and the frontend can keep using relative `/api/...` calls
— the browser only ever talks to your Netlify domain, which also sidesteps
CORS entirely (no `CLIENT_ORIGIN` juggling needed).

### Option C — GitHub Pages (frontend only)

GitHub Pages only serves static files — there's no way to run the Express
backend there. Use this only if you're fine with either **(a)** no working
contact form/admin/posts, or **(b)** pointing at a backend deployed via Option
A's step 2 anyway. `.github/workflows/deploy-frontend.yml` is already included
and handles the build:

1. Push to GitHub, then in the repo: **Settings → Pages → Source** → select
   **GitHub Actions** (not "Deploy from a branch").
2. If you want the API working: **Settings → Secrets and variables → Actions →
   Variables** tab → **New repository variable** → name `VITE_API_BASE_URL`,
   value `https://your-backend.vercel.app/api`. Skip this for a static-only
   preview.
3. Push to `main` (or run the workflow manually from the **Actions** tab). It
   builds `frontend/` and publishes `frontend/dist` to Pages automatically.
4. Your site is live at `https://<username>.github.io/<repo-name>/`.

The workflow sets `VITE_BASE_PATH=/<repo-name>/` automatically (GitHub Pages
project sites are served from a subpath, unlike Vercel/Netlify's domain root)
— you don't need to configure that part yourself. If you're deploying to a
*user/org* Pages site (`<username>.github.io`, served from the root instead),
delete that one `VITE_BASE_PATH` line from the workflow file.

### Post-deployment checklist

- [ ] `curl https://<backend-url>/health` returns `{"status":"ok"}`.
- [ ] `curl https://<backend-url>/api/profile` returns the profile JSON (not a CORS or 500 error).
- [ ] Opening the deployed frontend shows real data, not the "Could not reach the API" screen.
- [ ] Browser devtools console has no CORS errors when the frontend calls the backend.
- [ ] `MONGODB_URI` is set on the backend host — without it, an admin-added post or contact message can disappear on the next cold start.
- [ ] `ADMIN_TOKEN` is set to a long random value (not left as the `.env.example` placeholder) — anyone with it can post content and read the contact inbox.
- [ ] `/?admin=1` on the deployed frontend logs in with that token and can list posts/messages.
- [ ] Submitting the public contact form succeeds, and the message shows up in the admin inbox.
- [ ] If you set a custom domain: update `CLIENT_ORIGIN` (backend) to match it, and the SEO placeholders (`sanaullah.dev` — see [SEO](#seo)) to the real domain.

## Troubleshooting

**Frontend shows "Could not reach the API."**
The backend isn't reachable at the URL the frontend is configured with. Check
`VITE_API_BASE_URL` was set *at build time* (Vite bakes it into the build —
changing an env var on the host requires a fresh deploy/rebuild, not just a
restart) and that `curl <that-url>/health` works from your own machine.

**Browser console shows a CORS error.**
`CLIENT_ORIGIN` on the backend doesn't include the frontend's exact origin
(scheme + domain, no trailing slash — `https://your-site.vercel.app`, not
`https://your-site.vercel.app/`). Update it and redeploy the backend; CORS
config is read at server start, not per-request.

**Admin panel says "Invalid or missing admin token" or the API returns 503 for `/api/contact`/`/api/posts` writes.**
503 means `ADMIN_TOKEN` isn't set on the backend host at all. 401 means it *is*
set, but doesn't match what you typed into the admin panel's login screen —
retype it (it's case-sensitive, stored per-browser in `sessionStorage`, so a
stale value from an earlier deploy can linger).

**A contact message or admin-added post disappeared.**
`MONGODB_URI` isn't set (or isn't reachable) on the backend host, so it's
using the in-memory fallback — which does not survive a serverless cold start
or a traditional server restart. Set it (see [Database setup](#database-setup)).

**MongoDB Atlas connection times out or refuses the connection.**
Almost always **Network Access**: add `0.0.0.0/0` in Atlas for a serverless
backend (fixed IPs aren't available there), or your current IP for local dev
if it changed. Double-check the username/password in the connection string
too — a `@` or other special character in the password needs URL-encoding.

**GitHub Pages build succeeds but the deployed site is blank / assets 404.**
`VITE_BASE_PATH` doesn't match the repo name (it must be `/<exact-repo-name>/`,
case-sensitive, leading *and* trailing slash) — the included workflow sets
this automatically from `github.event.repository.name`, so this usually only
happens if you renamed the repo after first deploying, or are deploying a
user/org site and forgot to delete that env line (see
[Option C](#option-c--github-pages-frontend-only)).

**Building locally on Windows with Git Bash / MSYS and a `VITE_BASE_PATH`-style env var gets mangled.**
Git Bash auto-converts Unix-looking paths (anything starting with `/`) passed
as command-line arguments or inline env vars into Windows paths, so
`VITE_BASE_PATH=/Portfolio/ npm run build` can silently turn into something
like `C:/Program Files/Git/Portfolio/`. Prefix the command with
`MSYS_NO_PATHCONV=1` to stop that, or set the variable in `frontend/.env`
instead of inline on the command line. This only affects local Git Bash builds
— GitHub Actions' Linux runners aren't affected, so the included workflow
doesn't need this.

**`npm test` fails with a MongoDB connection error.**
It shouldn't — both test suites are designed to run entirely against
in-memory repositories (see [Tests](#tests)) with no real database involved.
If you see a Mongo-related failure, check you haven't imported a Mongo
repository directly into a test instead of the in-memory one.
