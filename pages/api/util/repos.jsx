export default async function handler(req, res) {
  const USERNAME = (process.env.GITHUB_USERNAME || "olanolduknk").trim();
  const LIMIT = Math.max(1, Number(process.env.GITHUB_REPO_LIMIT || 6));
  const EXCLUDE_FORKS = String(process.env.GITHUB_EXCLUDE_FORKS || "false").toLowerCase() === "true";

  try {
    const r = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: {
          accept: "application/vnd.github+json",
          "user-agent": "ozturkweb",
        },
      }
    );

    if (!r.ok) {
      // Eski davranış: hata olsa bile siteyi düşürme, boş array dön
      return res.status(200).json([]);
    }

    const data = await r.json();
    if (!Array.isArray(data)) return res.status(200).json([]);

    const filtered = EXCLUDE_FORKS ? data.filter((x) => !x.fork) : data;

    // Eski component direkt repo objelerini kullanıyor, map falan yapmıyoruz
    return res.status(200).json(filtered.slice(0, LIMIT));
  } catch {
    return res.status(200).json([]);
  }
}
