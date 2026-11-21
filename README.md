# RCore Solutions - MERN Website

```
rcore-solutions/
├── backend/    Express + MongoDB (Mongoose) API
└── frontend/   React (Vite) website + admin panel
```

## Quick start
1. Install Node 18+ and MongoDB (or use a MongoDB Atlas URI).
2. `npm run install:all`
3. Edit `backend/.env` (copy of `.env.example`): set `MONGO_URI`, a long `JWT_SECRET`, and your admin email/password.
4. `npm run seed`  (creates admin, default settings, sample services and products)
5. `npm run dev`  ->  website: http://localhost:5173  |  API: http://localhost:5000

Admin login: the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` (default `admin@rcoresolutions.com` / `Admin@12345`). Change it after first login.

## Roles
- **User**: register / login, view services and products, write reviews, send contact messages, edit own profile.
- **Admin** (`/admin`): full CRUD for users, services and products; hide/delete reviews; read messages; edit website settings (name, logo, theme color, hero text, about, WhatsApp number, contact info, socials, footer, currency).

## Production
`npm run build` then `npm start`. The backend serves `frontend/dist` automatically, so one server runs everything.
Set `NODE_ENV=production`, a strong `JWT_SECRET`, and `CLIENT_URL` if the frontend is hosted separately (then set `VITE_API_URL` and `VITE_ASSET_URL` when building the frontend).

## Notes
- WhatsApp number is stored in Admin > Website settings (country code, digits only).
- Image uploads are stored in `backend/uploads`.
- Mega menu groups services/products by their **Category** field automatically.

---

# Deploy on Vercel (two projects: backend + frontend)

Vercel is serverless, so the API and the website are deployed as **two separate Vercel projects** from the same GitHub repo.
Uploaded images are stored in MongoDB (served from `/api/images/:id`), so nothing needs a writable disk.

## 1. MongoDB Atlas (free)
1. Create a cluster at https://cloud.mongodb.com and a database user.
2. Network Access -> **Add IP Address -> Allow access from anywhere (0.0.0.0/0)** (Vercel has no fixed IP).
3. Copy the connection string, e.g. `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/rcore_solutions`

## 2. Seed the database (once, from your computer)
Put the Atlas string in `backend/.env` as `MONGO_URI`, then run `npm run seed`.
This creates the admin account, settings and sample content in Atlas.

## 3. Push to GitHub
Push the whole `rcore-solutions` folder to a GitHub repository.

## 4. Deploy the backend
Vercel -> **Add New Project** -> import the repo ->
- **Root Directory:** `backend`
- Framework Preset: **Other**
- Environment Variables:
  - `MONGO_URI` = your Atlas string
  - `JWT_SECRET` = long random string
  - `CLIENT_URL` = (add after step 5) your frontend URL, e.g. `https://rcore-solutions.vercel.app`
  - `NODE_ENV` = `production`

Deploy, then open `https://YOUR-BACKEND.vercel.app/api/health` - it should show `{"status":"ok"}`.

## 5. Deploy the frontend
Vercel -> **Add New Project** -> same repo ->
- **Root Directory:** `frontend`
- Framework Preset: **Vite** (build `npm run build`, output `dist`)
- Environment Variables:
  - `VITE_API_URL` = `https://YOUR-BACKEND.vercel.app/api`
  - `VITE_ASSET_URL` = `https://YOUR-BACKEND.vercel.app`

Deploy. Then go back to the **backend** project -> Settings -> Environment Variables -> set `CLIENT_URL` to the frontend URL -> **Redeploy**.

## Troubleshooting
- "Server is not configured correctly": check `MONGO_URI`, `JWT_SECRET` and Atlas Network Access (0.0.0.0/0).
- CORS error in the browser: `CLIENT_URL` must exactly match the frontend URL (no trailing slash). Redeploy the backend after changing it.
- Changed a `VITE_` variable: redeploy the frontend (they are baked in at build time).
- Max upload size is 3 MB per image (Vercel request limit is 4.5 MB).
