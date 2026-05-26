# Stolen Artworks Intelligence Dashboard

This project is ready for the assignment **Deployment of a Dashboard with its own Data Pipeline**. It uses:

- **Front end:** React + Vite + Recharts
- **Back end:** Netlify Functions
- **Database:** Supabase/PostgreSQL
- **Data pipeline:** Curated ETL script + Netlify scheduled refresh function
- **Deployment:** Netlify URL, not localhost

## What the dashboard shows

The app analyzes a stolen-artworks case database using cards, filters, charts, and a searchable table. It includes status mix, category distribution, theft timeline, country distribution, value vs theft-year scatter plot, and case-level source links.

## Folder structure

```text
src/                         React dashboard
netlify/functions/           API functions and scheduled ETL refresh
database/schema.sql          Supabase/PostgreSQL tables and policies
database/seed_data.sql       Seed rows for the database
data/stolen_art_seed.json    Curated raw dataset
scripts/                     CLI seed and ETL scripts
executive_summary.md         One-page assignment summary
```

## Local setup

```bash
npm install
npm run dev
```

For Netlify Functions locally, use Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

## Database setup

1. Create a free Supabase project.
2. Open **SQL Editor**.
3. Run `database/schema.sql`.
4. Run `database/seed_data.sql`.
5. Copy your Supabase Project URL and service-role key.
6. In Netlify, add these environment variables:

```text
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ETL_TOKEN=YOUR_RANDOM_PASSWORD
```

## Deploy to Netlify

1. Push this folder to GitHub.
2. In Netlify, choose **Add new site -> Import an existing project**.
3. Select the repository.
4. Netlify will read `netlify.toml`:
   - build command: `npm run build`
   - publish directory: `dist`
5. Add the three environment variables above.
6. Click **Deploy**.
7. Use the Netlify URL for the in-class demo. Do not use a localhost URL.

## Data refresh mechanism

The file `netlify/functions/refresh-data.mjs` is a Netlify Scheduled Function. It runs daily at 06:00 UTC and upserts the curated transformed data into Supabase. You can also refresh manually after deployment:

```text
https://YOUR-SITE.netlify.app/.netlify/functions/refresh-data?token=YOUR_ETL_TOKEN
```

## Grading alignment

- **Data Pipeline / ETL / Wrangling (4 pts):** cleaned seed data, risk-score calculation, ETL script, scheduled refresh, database upsert, ETL run logging.
- **Visualization (3 pts):** KPI cards, timeline, status pie chart, category bar chart, country bar chart, value scatter plot, interactive filters, searchable table.
- **Data refresh mechanism (2 pts):** Netlify scheduled function + protected manual refresh endpoint.
- **Communication (2 pts):** one-page executive summary in Markdown and PDF-ready format.

## Important note

This is a teaching/demo dataset compiled from public case descriptions and source links. It is not an official law-enforcement stolen-art registry. For real investigations, the FBI National Stolen Art File, Interpol database, or local law-enforcement sources should be consulted directly.
