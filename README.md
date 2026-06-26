git commit -m "chore: add comprehensive gitignore for Node and Next.js"# ShipmentHub Web

Next.js 14 (App Router) front-end for the ShipmentHub logistics coordination platform.

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Leaflet (react-leaflet) · Axios

## Setup

```bash
cp .env.local.example .env.local   # Windows PowerShell: copy .env.local.example .env.local
npm install
npm run dev                        # http://localhost:3000
```

> Make sure the API is running (default `http://localhost:4000`) and `NEXT_PUBLIC_API_URL`
> points at it.

## Scripts

| Script          | Description                  |
| --------------- | --------------------------- |
| `npm run dev`   | Start the dev server        |
| `npm run build` | Production build            |
| `npm start`     | Serve the production build  |
| `npm run lint`  | Lint with ESLint            |

## Routes

| Route                          | Access   | Description                                |
| ------------------------------ | -------- | ----------------------------------------- |
| `/`                            | Public   | Landing page                              |
| `/signin`                      | Public   | Login (with seeded demo accounts)         |
| `/dashboard`                   | Auth     | Role-aware overview                       |
| `/dashboard/shipments`         | Auth     | Shipment list                             |
| `/dashboard/shipments/new`     | Client   | Create a shipment                         |
| `/dashboard/shipments/[id]`    | Auth     | Detail, timeline, map, operator controls  |
| `/track/[token]`               | Public   | Public tracking page                      |

## Project layout

```
app/            # App Router pages
components/      # UI, map, timeline, forms
context/         # AuthContext (JWT session)
hooks/           # usePolling
lib/             # api client, auth storage, types, helpers
```