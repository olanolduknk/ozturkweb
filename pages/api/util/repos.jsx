export default async function handler(req, res) {
  const USERNAME = "olanolduknk"; // burada hangi hesabın repoları görünsün istiyorsan onu yaz

  try {
    const r = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=6&sort=updated`,
      {
        headers: {
          accept: "application/vnd.github+json",
          "user-agent": "ozturkweb",
        },
      }
    );

    if (!r.ok) {
      return res.status(200).json({
        ok: false,
        error: "github_http_error",
        http_status: r.status,
        repos: [],
      });
    }

    const data = await r.json();

    // GitHub bazen rate-limitte object döndürür; array değilse güvenli fallback.
    if (!Array.isArray(data)) {
      return res.status(200).json({
        ok: false,
        error: "github_bad_payload",
        repos: [],
      });
    }

    const repos = data
      .filter((x) => !x.fork)
      .slice(0, 6)
      .map((x) => ({
        name: x.name,
        full_name: x.full_name,
        html_url: x.html_url,
        description: x.description,
        stargazers_count: x.stargazers_count,
        forks_count: x.forks_count,
        language: x.language,
      }));

    return res.status(200).json({ ok: true, repos });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      error: "github_exception",
      message: String(e?.message || e),
      repos: [],
    });
  }
}
