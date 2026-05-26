import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=60"
};

export function response(statusCode, body) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(body, null, 2) };
}

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function calculateRiskScore(item) {
  const value = Number(item.estimated_value_usd_m || 0);
  const age = 2026 - Number(item.theft_year || 2026);
  const base = item.status === "Missing" ? 35 : item.status === "Unknown" ? 18 : 6;
  const valueScore = Math.min(value * 0.09, 35);
  const ageScore = Math.min(age * 0.4, 20);
  const categoryScore = ["Painting", "Sculpture"].includes(item.category) ? 8 : 4;
  return Math.round(Math.min(base + valueScore + ageScore + categoryScore, 100) * 10) / 10;
}

export function normalizeArtwork(item) {
  return {
    ...item,
    title: String(item.title || "Untitled").trim(),
    artist: String(item.artist || "Unknown").trim(),
    category: String(item.category || "Unknown").trim(),
    country_of_theft: String(item.country_of_theft || "Unknown").trim(),
    city_of_theft: String(item.city_of_theft || "Unknown").trim(),
    status: ["Missing", "Recovered", "Unknown"].includes(item.status) ? item.status : "Unknown",
    estimated_value_usd_m: Number(item.estimated_value_usd_m || 0),
    theft_year: Number(item.theft_year || new Date().getFullYear()),
    recovery_year: item.recovery_year ? Number(item.recovery_year) : null,
    risk_score: item.risk_score ? Number(item.risk_score) : calculateRiskScore(item)
  };
}

export function loadFallbackData() {
  const file = new URL("../../data/stolen_art_seed.json", import.meta.url);
  return JSON.parse(fs.readFileSync(file, "utf-8")).map(normalizeArtwork);
}

export async function loadArtworks() {
  const supabase = getSupabase();
  if (!supabase) {
    return { artworks: loadFallbackData(), fromDatabase: false, lastRun: null };
  }

  const { data, error } = await supabase
    .from("stolen_artworks")
    .select("*")
    .order("theft_year", { ascending: true });

  if (error) {
    console.error("Supabase read failed, using fallback data", error.message);
    return { artworks: loadFallbackData(), fromDatabase: false, lastRun: null, dbError: error.message };
  }

  const { data: runs } = await supabase
    .from("etl_runs")
    .select("source_name, rows_loaded, run_status, details, created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  return { artworks: (data || []).map(normalizeArtwork), fromDatabase: true, lastRun: runs?.[0] || null };
}

export function buildSummary(artworks, lastRun = null, fromDatabase = false) {
  const total = artworks.length;
  const missing = artworks.filter(a => a.status === "Missing").length;
  const recovered = artworks.filter(a => a.status === "Recovered").length;
  const unknown = artworks.filter(a => a.status === "Unknown").length;
  const totalValue = artworks.reduce((sum, a) => sum + Number(a.estimated_value_usd_m || 0), 0);

  const recoveredDurations = artworks
    .filter(a => a.recovery_year && a.theft_year)
    .map(a => a.recovery_year - a.theft_year);
  const avgRecoveryYears = recoveredDurations.length
    ? recoveredDurations.reduce((a, b) => a + b, 0) / recoveredDurations.length
    : 0;

  const group = (key) => Object.values(artworks.reduce((acc, row) => {
    const label = row[key] || "Unknown";
    if (!acc[label]) acc[label] = { name: label, count: 0, value: 0 };
    acc[label].count += 1;
    acc[label].value += Number(row.estimated_value_usd_m || 0);
    return acc;
  }, {})).sort((a, b) => b.count - a.count || b.value - a.value);

  const timeline = Object.values(artworks.reduce((acc, row) => {
    const year = row.theft_year || "Unknown";
    if (!acc[year]) acc[year] = { year, count: 0, missing: 0, recovered: 0, unknown: 0 };
    acc[year].count += 1;
    if (row.status === "Missing") acc[year].missing += 1;
    if (row.status === "Recovered") acc[year].recovered += 1;
    if (row.status === "Unknown") acc[year].unknown += 1;
    return acc;
  }, {})).sort((a, b) => Number(a.year) - Number(b.year));

  const topValuable = [...artworks]
    .sort((a, b) => Number(b.estimated_value_usd_m || 0) - Number(a.estimated_value_usd_m || 0))
    .slice(0, 8);

  return {
    kpis: {
      total_cases: total,
      missing_cases: missing,
      recovered_cases: recovered,
      unknown_cases: unknown,
      recovery_rate: total ? Math.round((recovered / total) * 1000) / 10 : 0,
      estimated_total_value_usd_m: Math.round(totalValue * 10) / 10,
      average_recovery_years: Math.round(avgRecoveryYears * 10) / 10
    },
    charts: {
      byStatus: group("status"),
      byCategory: group("category"),
      byCountry: group("country_of_theft"),
      timeline,
      topValuable
    },
    meta: {
      fromDatabase,
      record_count: total,
      last_etl_run: lastRun,
      generated_at: new Date().toISOString()
    }
  };
}
