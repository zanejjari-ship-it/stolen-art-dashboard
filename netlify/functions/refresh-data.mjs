import { schedule } from "@netlify/functions";
import { getSupabase, loadFallbackData, normalizeArtwork, response } from "./_shared.mjs";

async function refresh(event = {}) {
  try {
    const isScheduled = event?.headers?.["x-nf-event"] === "schedule" || event?.rawUrl === undefined;
    const token = event?.queryStringParameters?.token || event?.headers?.["x-etl-token"];

    if (!isScheduled && process.env.ETL_TOKEN && token !== process.env.ETL_TOKEN) {
      return response(401, { error: "Unauthorized. Add ?token=YOUR_ETL_TOKEN or x-etl-token header." });
    }

    const supabase = getSupabase();
    const rows = loadFallbackData().map(normalizeArtwork);

    if (!supabase) {
      return response(200, {
        status: "fallback_only",
        rows_loaded: rows.length,
        message: "No Supabase environment variables found. Data was transformed but not written to a remote database."
      });
    }

    const { error } = await supabase.from("stolen_artworks").upsert(rows, { onConflict: "id" });
    if (error) throw error;

    await supabase.from("etl_runs").insert({
      source_name: "curated_seed_netlify_scheduled_etl",
      rows_loaded: rows.length,
      run_status: "success",
      details: "Daily ETL transformed the curated stolen-artworks dataset and upserted records."
    });

    return response(200, {
      status: "success",
      rows_loaded: rows.length,
      refreshed_at: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("etl_runs").insert({
        source_name: "curated_seed_netlify_scheduled_etl",
        rows_loaded: 0,
        run_status: "failed",
        details: error.message
      });
    }
    return response(500, { error: error.message });
  }
}

export const handler = schedule("0 6 * * *", refresh);
