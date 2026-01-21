let CACHE = {
  data: null,
  expires: 0,
  etag: null,
};

export default async function handler(req, res) {
  const USERNAME = (process.env.GITHUB_USERNAME || "olanolduknk").trim();
  const LIMIT = Math.max(1, Number(process.env.GITHUB_REPO_LIMIT || 6));
  const EXCLUDE_FORKS = String(process.env.GITHUB_EXCLUDE_FORKS || "false").toLowerCase() === "true";
  const TOKEN = process.env.GITHUB_TOKEN || null;

  const now = Date.now();

  // Cache geçerliyse direkt dön
  if (CACHE.data && now < CACHE.expires) {
    return res.status(200).json(CACHE.data.slice(0, LIMIT));
  }

  try {
    const headers = {
      accept: "application/vnd.github+json",
      "user-agent": "ozturkweb",
    };

    if (TOKEN) headers.authorization = `Bearer ${TOKEN}`;
    if (CACHE.etag) headers["If-None-Match"] = CACHE.etag;

    const r = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
      { headers }
    );

    // Değişmemiş data → cache’i uzat
    if (r.status === 304 && CACHE.data) {
      CACHE.expires = now + 1000 * 60 * 60; // 1 saat
      return res.status(200).json(CACHE.data.slice(0, LIMIT));
    }

    if (!r.ok) {
      // GitHub çökerse bile site çökmesin → stale cache
      if (CACHE.data) return res.status(200).json(CACHE.data.slice(0, LIMIT));
      return res.status(200).json([]);
    }

    const data = await r.json();
    if (!Array.isArray(data)) return res.status(200).json([]);

    const filtered = EXCLUDE_FORKS ? data.filter((x) => !x.fork) : data;

    CACHE = {
      data: filtered,
      expires: now + 1000 * 60 * 60, // 1 saat cache
      etag: r.headers.get("etag"),
    };

    return res.status(200).json(filtered.slice(0, LIMIT));
  } catch {
    if (CACHE.data) return res.status(200).json(CACHE.data.slice(0, LIMIT));
    return res.status(200).json([]);
  }
}
