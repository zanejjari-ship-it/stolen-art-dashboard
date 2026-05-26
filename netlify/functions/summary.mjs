import { loadArtworks, buildSummary, response } from "./_shared.mjs";

export async function handler() {
  try {
    const { artworks, fromDatabase, lastRun, dbError } = await loadArtworks();
    const summary = buildSummary(artworks, lastRun, fromDatabase);
    summary.meta.dbError = dbError || null;
    return response(200, summary);
  } catch (error) {
    console.error(error);
    return response(500, { error: error.message });
  }
}
