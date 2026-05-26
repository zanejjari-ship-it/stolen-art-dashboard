import { loadArtworks, response } from "./_shared.mjs";

export async function handler(event) {
  try {
    const { artworks, fromDatabase, lastRun, dbError } = await loadArtworks();
    const params = event.queryStringParameters || {};
    const q = (params.q || "").toLowerCase().trim();
    const status = params.status || "All";
    const category = params.category || "All";

    const filtered = artworks.filter(row => {
      const qMatch = !q || [row.title, row.artist, row.country_of_theft, row.city_of_theft, row.institution, row.notes]
        .join(" ").toLowerCase().includes(q);
      const statusMatch = status === "All" || row.status === status;
      const categoryMatch = category === "All" || row.category === category;
      return qMatch && statusMatch && categoryMatch;
    });

    return response(200, {
      data: filtered,
      meta: {
        count: filtered.length,
        total_records: artworks.length,
        fromDatabase,
        last_etl_run: lastRun,
        dbError: dbError || null
      }
    });
  } catch (error) {
    console.error(error);
    return response(500, { error: error.message });
  }
}
