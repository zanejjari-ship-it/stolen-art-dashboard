import { getSupabase, loadFallbackData, normalizeArtwork, response } from "./_shared.mjs";

export async function handler(event = {}) {
  try {
    const token = event?.queryStringParameters?.token || event?.headers?.["x-etl-token"];

    if (process.env.ETL_TOKEN && token !== process.env.ETL_TOKEN) {
      return response(401, {
        error: "Unauthorized. Add ?token=YOUR_ETL_TOKEN."
      });
    }

    const supabase = getSupabase();

    if (!supabase) {
      return response(500, {
        error: "Supabase is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      });
    }

    const rows = loadFallbackData().map(normalizeArtwork);

    const { error: upsertError } = await supabase
      .from("stolen_artworks")
      .upsert(rows, { onConflict: "id" });

    if (upsertError) {
      throw new Error(`Upsert failed: ${upsertError.message}`);
    }

    const { error: logError } = await supabase
      .from("etl_runs")
      .insert({
        source_name: "manual_dashboard_refresh",
        rows_loaded: rows.length,
        run_status: "success",
        details: "Manual ETL refresh from dashboard button."
      });

    if (logError) {
      throw new Error(`ETL log failed: ${logError.message}`);
    }

    return response(200, {
      status: "success",
      rows_loaded: rows.length,
      refreshed_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("Refresh failed:", error);
    return response(500, {
      error: error.message || "Unknown refresh error"
    });
  }
}
