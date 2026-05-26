# Supabase database setup

1. Create a free Supabase project.
2. Open **SQL Editor**.
3. Paste and run `database/schema.sql`.
4. Paste and run `database/seed_data.sql`.
5. Go to **Project Settings -> API** and copy:
   - `Project URL` into `SUPABASE_URL`
   - `service_role` key into `SUPABASE_SERVICE_ROLE_KEY`
6. Add both variables in Netlify under **Site configuration -> Environment variables**.
7. Add `ETL_TOKEN` as a long random password. This protects the manual ETL endpoint.

Optional CLI seed:

```bash
cp .env.example .env
# fill SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm install
npm run seed
```

Manual refresh endpoint after deployment:

```text
https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/refresh-data?token=YOUR_ETL_TOKEN
```

The scheduled ETL also runs daily through Netlify Scheduled Functions.
