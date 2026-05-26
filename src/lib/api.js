async function safeFetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function getSummary() {
  return safeFetchJSON("/.netlify/functions/summary");
}

export async function getArtworks({ q = "", status = "All", category = "All" } = {}) {
  const params = new URLSearchParams({ q, status, category });
  return safeFetchJSON(`/.netlify/functions/artworks?${params.toString()}`);
}
