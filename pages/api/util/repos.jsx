const DEFAULT_USERNAME = "ozturkbey";
const CACHE_TTL_MS = 1000 * 60 * 60;

let CACHE = {
  data: null,
  expires: 0,
  etag: null,
  username: null,
};

async function fetchRepos({ username, token, etag }) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "ozturkweb",
  };

  if (token) headers.authorization = `Bearer ${token}`;
  if (etag) headers["If-None-Match"] = etag;

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );

  return response;
}

export default async function handler(req, res) {
  const USERNAME = (process.env.GITHUB_USERNAME || DEFAULT_USERNAME).trim();
  const FALLBACK_USERNAME = (process.env.GITHUB_FALLBACK_USERNAME || DEFAULT_USERNAME).trim();
  const LIMIT = Math.max(1, Number(process.env.GITHUB_REPO_LIMIT || 6));
  const EXCLUDE_FORKS = String(process.env.GITHUB_EXCLUDE_FORKS || "false").toLowerCase() === "true";
  const TOKEN = process.env.GITHUB_TOKEN || null;

  const now = Date.now();

  // Cache geçerliyse direkt dön
  if (CACHE.data && now < CACHE.expires && CACHE.username === USERNAME) {
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).json(CACHE.data.slice(0, LIMIT));
  }

  try {
    let r = await fetchRepos({ username: USERNAME, token: TOKEN, etag: CACHE.etag });

    // Değişmemiş data → cache’i uzat
    if (r.status === 304 && CACHE.data) {
      CACHE.expires = now + CACHE_TTL_MS;
      res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
      return res.status(200).json(CACHE.data.slice(0, LIMIT));
    }

    if (r.status === 404 && USERNAME !== FALLBACK_USERNAME) {
      r = await fetchRepos({ username: FALLBACK_USERNAME, token: TOKEN, etag: null });
    }

    if (!r.ok) {
      // GitHub çökerse bile site çökmesin → stale cache
      if (CACHE.data) {
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
        return res.status(200).json(CACHE.data.slice(0, LIMIT));
      }
      return res.status(200).json([]);
    }

    const data = await r.json();
    if (!Array.isArray(data)) return res.status(200).json([]);

    const filtered = EXCLUDE_FORKS ? data.filter((x) => !x.fork) : data;
    const cacheUsername = r.url.includes(`/users/${FALLBACK_USERNAME}/`) ? FALLBACK_USERNAME : USERNAME;

    CACHE = {
      data: filtered,
      expires: now + CACHE_TTL_MS,
      etag: r.headers.get("etag"),
      username: cacheUsername,
    };

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).json(filtered.slice(0, LIMIT));
  } catch {
    if (CACHE.data) {
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
      return res.status(200).json(CACHE.data.slice(0, LIMIT));
    }
    return res.status(200).json([]);
  }
}
