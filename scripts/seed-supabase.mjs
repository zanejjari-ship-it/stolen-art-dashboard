import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env or set environment variables.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const file = new URL("../data/stolen_art_seed.json", import.meta.url);
const rows = JSON.parse(fs.readFileSync(file, "utf-8"));

const { error } = await supabase.from("stolen_artworks").upsert(rows, { onConflict: "id" });
if (error) {
  console.error(error.message);
  process.exit(1);
}

await supabase.from("etl_runs").insert({
  source_name: "curated_seed_cli",
  rows_loaded: rows.length,
  run_status: "success",
  details: "Loaded seed records through npm run seed."
});

console.log(`Loaded ${rows.length} records into Supabase.`);
