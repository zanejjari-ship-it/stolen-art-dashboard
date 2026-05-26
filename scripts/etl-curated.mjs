import fs from "node:fs";

const input = new URL("../data/stolen_art_seed.json", import.meta.url);
const output = new URL("../data/stolen_art_seed.cleaned.json", import.meta.url);
const raw = JSON.parse(fs.readFileSync(input, "utf-8"));

function riskScore(item) {
  const value = Number(item.estimated_value_usd_m || 0);
  const age = 2026 - Number(item.theft_year || 2026);
  const base = item.status === "Missing" ? 35 : item.status === "Unknown" ? 18 : 6;
  const valueScore = Math.min(value * 0.09, 35);
  const ageScore = Math.min(age * 0.4, 20);
  const categoryScore = ["Painting", "Sculpture"].includes(item.category) ? 8 : 4;
  return Math.round(Math.min(base + valueScore + ageScore + categoryScore, 100) * 10) / 10;
}

const cleaned = raw.map(row => ({
  ...row,
  title: String(row.title || "Untitled").trim(),
  artist: String(row.artist || "Unknown").trim(),
  status: ["Missing", "Recovered", "Unknown"].includes(row.status) ? row.status : "Unknown",
  estimated_value_usd_m: Number(row.estimated_value_usd_m || 0),
  theft_year: Number(row.theft_year),
  recovery_year: row.recovery_year ? Number(row.recovery_year) : null,
  risk_score: riskScore(row)
}));

fs.writeFileSync(output, JSON.stringify(cleaned, null, 2));
console.log(`Transformed ${cleaned.length} records -> ${output.pathname}`);
