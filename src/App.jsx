import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend
} from "recharts";
import { Search, Database, RefreshCw, ExternalLink, ShieldAlert } from "lucide-react";
import { getArtworks, getSummary } from "./lib/api.js";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat("en-US");
const COLORS = ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db", "#111827"];

function KpiCard({ label, value, help }) {
  return (
    <section className="kpi-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{help}</small>
    </section>
  );
}

function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}

export default function App() {
  const [summary, setSummary] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [summaryData, artworkData] = await Promise.all([
        getSummary(),
        getArtworks({ q, status, category })
      ]);
      setSummary(summaryData);
      setArtworks(artworkData.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "The dashboard API could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [q, status, category]);

  const categories = useMemo(() => {
    const set = new Set((summary?.charts?.byCategory || []).map(item => item.name));
    return ["All", ...Array.from(set).sort()];
  }, [summary]);

  const scatterData = useMemo(() => artworks.map(row => ({
    ...row,
    value: Number(row.estimated_value_usd_m || 0),
    year: Number(row.theft_year || 0)
  })), [artworks]);

  const lastRunText = summary?.meta?.last_etl_run?.created_at
    ? new Date(summary.meta.last_etl_run.created_at).toLocaleString()
    : summary?.meta?.generated_at ? new Date(summary.meta.generated_at).toLocaleString() : "Not available";

  return (
    <main className="dashboard-shell">
      <header className="hero">
        <div>
          <p className="eyebrow"><ShieldAlert size={18} /> Cultural Heritage Risk Analytics</p>
          <h1>Stolen Artworks Intelligence Dashboard</h1>
          <p className="hero-copy">
            A deployed React dashboard with a serverless ETL pipeline and Supabase/PostgreSQL database for exploring high-profile stolen art cases by status, country, category, year, value, and recovery pattern.
          </p>
        </div>
        <aside className="pipeline-card">
          <Database size={24} />
          <div>
            <strong>{summary?.meta?.fromDatabase ? "Live database connected" : "Fallback sample data"}</strong>
            <span>Last data refresh: {lastRunText}</span>
          </div>
          <button onClick={loadData} disabled={loading} className="refresh-button">
            <RefreshCw size={16} /> Refresh view
          </button>
        </aside>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="kpi-grid">
        <KpiCard label="Total cases" value={numberFmt.format(summary?.kpis?.total_cases || 0)} help="Records in database" />
        <KpiCard label="Missing cases" value={numberFmt.format(summary?.kpis?.missing_cases || 0)} help="Open/unrecovered records" />
        <KpiCard label="Recovery rate" value={`${summary?.kpis?.recovery_rate || 0}%`} help="Recovered / total records" />
        <KpiCard label="Estimated value" value={`${currency.format((summary?.kpis?.estimated_total_value_usd_m || 0) * 1_000_000)}`} help="Approx. public estimates" />
      </section>

      <section className="controls-card">
        <label className="search-box">
          <Search size={18} />
          <input
            value={q}
            onChange={event => setQ(event.target.value)}
            placeholder="Search title, artist, country, institution..."
          />
        </label>
        <select value={status} onChange={event => setStatus(event.target.value)}>
          {["All", "Missing", "Recovered", "Unknown"].map(option => <option key={option}>{option}</option>)}
        </select>
        <select value={category} onChange={event => setCategory(event.target.value)}>
          {categories.map(option => <option key={option}>{option}</option>)}
        </select>
      </section>

      <section className="chart-grid">
        <article className="chart-card wide">
          <div className="card-heading">
            <h2>Theft timeline</h2>
            <p>Cases by theft year and current status.</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={summary?.charts?.timeline || []} margin={{ left: 8, right: 18, top: 10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="missing" stroke="#991b1b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="recovered" stroke="#166534" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="unknown" stroke="#92400e" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <div className="card-heading">
            <h2>Status mix</h2>
            <p>Missing vs recovered vs unknown.</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={summary?.charts?.byStatus || []} dataKey="count" nameKey="name" outerRadius={95} label>
                {(summary?.charts?.byStatus || []).map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <div className="card-heading">
            <h2>Categories</h2>
            <p>Records by artwork type.</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary?.charts?.byCategory || []} margin={{ left: 4, right: 18, top: 10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#374151" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card wide">
          <div className="card-heading">
            <h2>Value vs year</h2>
            <p>Bubble size indicates the estimated value in USD millions; filters affect this chart.</p>
          </div>
          <ResponsiveContainer width="100%" height={310}>
            <ScatterChart margin={{ top: 20, right: 24, bottom: 16, left: 0 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="year" name="Theft year" domain={[1900, 2026]} />
              <YAxis type="number" dataKey="value" name="USD millions" />
              <ZAxis type="number" dataKey="value" range={[80, 900]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => name === "value" ? [`$${value}m`, "Value"] : value} />
              <Scatter data={scatterData} fill="#111827" />
            </ScatterChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <div className="card-heading">
            <h2>Countries</h2>
            <p>Top theft locations in the dataset.</p>
          </div>
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={(summary?.charts?.byCountry || []).slice(0, 8)} layout="vertical" margin={{ left: 70, right: 18, top: 10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="count" fill="#4b5563" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>

      <section className="table-card">
        <div className="card-heading">
          <h2>Case-level database</h2>
          <p>{loading ? "Loading..." : `${artworks.length} matching cases`}</p>
        </div>
        {artworks.length === 0 ? <EmptyState message="No cases match the current filters." /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Artwork</th>
                  <th>Artist</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Years</th>
                  <th>Value</th>
                  <th>Risk</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map(row => (
                  <tr key={row.id}>
                    <td><strong>{row.title}</strong><small>{row.institution}</small></td>
                    <td>{row.artist}</td>
                    <td><span className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</span></td>
                    <td>{row.city_of_theft}, {row.country_of_theft}</td>
                    <td>{row.theft_year}{row.recovery_year ? ` -> ${row.recovery_year}` : " -> open"}</td>
                    <td>${numberFmt.format(Math.round((row.estimated_value_usd_m || 0) * 1_000_000))}</td>
                    <td>{row.risk_score}</td>
                    <td>
                      {row.source_url ? <a href={row.source_url} target="_blank" rel="noreferrer">Open <ExternalLink size={13} /></a> : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
