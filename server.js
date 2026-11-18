// CareerMatch AI - tiny local server. Needs Node.js 18 or newer. No packages to install.
// It serves the website AND fetches real job vacancies from Adzuna using YOUR keys,
// which stay in the .env file on your computer and are never sent to the browser.
const http = require("http"), fs = require("fs"), path = require("path");

try { // read the .env file
  for (const line of fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch (e) { /* no .env yet */ }

if (typeof fetch !== "function") { console.log("Your Node.js is too old. Install the LTS version from https://nodejs.org (18 or newer) and try again."); process.exit(1); }
const PORT = Number(process.env.PORT) || 3000;
const ID = process.env.ADZUNA_APP_ID, KEY = process.env.ADZUNA_APP_KEY;
const COUNTRY = (process.env.ADZUNA_COUNTRY || "in").toLowerCase();
const BASE = process.env.ADZUNA_BASE || "https://api.adzuna.com/v1/api/jobs";
const cache = new Map(), TTL = 10 * 60 * 1000;   // same search is reused for 10 minutes
let used = 0, windowStart = Date.now();             // safety cap: 60 real API calls per hour

const send = (res, code, obj) => {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff" });
  res.end(JSON.stringify(obj));
};

function pay(x) {
  if (!x.salary_min) return "";
  const f = n => Math.round(n).toLocaleString("en-IN");
  return (COUNTRY === "in" ? "₹" : "") + f(x.salary_min) +
    (x.salary_max && x.salary_max !== x.salary_min ? "–" + f(x.salary_max) : "") + "/yr" +
    (String(x.salary_is_predicted) === "1" ? " (estimated)" : "");
}

async function adzuna(what, where) {
  if (Date.now() - windowStart > 3600e3) { used = 0; windowStart = Date.now(); }
  if (used >= 60) throw Object.assign(new Error("Hourly safety limit reached. Try again later."), { code: 429 });
  used++;
  const q = { app_id: ID, app_key: KEY, results_per_page: "25", what, max_days_old: "45", "content-type": "application/json" };
  if (where) q.where = where;
  let r;
  try { r = await fetch(`${BASE}/${COUNTRY}/search/1?` + new URLSearchParams(q)); }
  catch (e) { throw Object.assign(new Error("Could not reach Adzuna. Check your internet."), { code: 502 }); }
  if (r.status === 401 || r.status === 403) throw Object.assign(new Error("Adzuna rejected your keys. Check .env."), { code: 502 });
  if (!r.ok) throw Object.assign(new Error("Adzuna error " + r.status), { code: 502 });
  const d = await r.json();
  return (d.results || []).map(x => ({
    id: String(x.id),
    title: String(x.title || ""),
    company: (x.company && x.company.display_name) || "",
    loc: (x.location && x.location.display_name) || "",
    url: /^https?:\/\//.test(x.redirect_url || "") ? x.redirect_url : "",
    posted: x.created || "",
    desc: String(x.description || "").slice(0, 1500),
    pay: pay(x)
  })).filter(x => x.url && x.title);
}

http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://localhost");
  try {
    if (u.pathname === "/" || u.pathname === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" });
      return res.end(fs.readFileSync(path.join(__dirname, "index.html")));
    }
    if (u.pathname === "/api/status") return send(res, 200, { configured: !!(ID && KEY), country: COUNTRY });
    if (u.pathname === "/api/jobs") {
      const what = (u.searchParams.get("what") || "").trim().slice(0, 80);
      const where = (u.searchParams.get("where") || "").trim().slice(0, 60);
      if (!what) return send(res, 400, { error: "Enter a role to search." });
      if (!ID || !KEY) return send(res, 503, { error: "Adzuna keys are missing. Follow step 3 in the README." });
      const key = what.toLowerCase() + "|" + where.toLowerCase(), hit = cache.get(key);
      if (hit && Date.now() - hit.t < TTL) return send(res, 200, hit.v);
      let results = await adzuna(what, where), relaxed = false;
      if (!results.length && where) { results = await adzuna(what, ""); relaxed = results.length > 0; }
      const v = { results, relaxed };
      cache.set(key, { t: Date.now(), v });
      return send(res, 200, v);
    }
    send(res, 404, { error: "Not found" });
  } catch (e) { send(res, e.code || 500, { error: e.message || "Server error" }); }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`CareerMatch AI is running at http://localhost:${PORT}`);
  console.log(ID && KEY ? "Adzuna keys found. Live vacancies are ON." : "No Adzuna keys yet. Live vacancies are OFF (see README step 3).");
});
